import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function isDefaultAdmin() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    select: { password: true },
  })

  if (!user?.password) return false

  try {
    return await bcrypt.compare('admin123', user.password)
  } catch {
    return false
  }
}
