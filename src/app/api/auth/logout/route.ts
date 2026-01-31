import { redirect } from 'next/navigation'

export async function GET() {
  // 清除 session cookie
  redirect('/auth/signout')
}
