import NextAuth, { CredentialsSignin } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { getSetting } from './settings'
import bcrypt from 'bcryptjs'
import { getClientIp, rateLimit } from './rate-limit'

class RateLimitError extends CredentialsSignin {
  code = 'rate_limited'
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const clientIp = request ? getClientIp(request) : 'unknown'
        const emailKey = String(credentials.email).toLowerCase()
        const limit = rateLimit(`login:${clientIp}:${emailKey}`, {
          windowMs: 5 * 60 * 1000,
          max: 30,
        })

        if (!limit.ok) {
          throw new RateLimitError()
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user }) {
      const allowRegistration = (await getSetting<boolean>('auth.allowRegistration', true)) ?? true

      if (!allowRegistration) {
        const email = user?.email
        if (!email) return false
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (!existingUser) return false
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'USER' | 'ADMIN'
      }
      return session
    },
  },
})
