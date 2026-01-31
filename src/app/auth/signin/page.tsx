import { SignInForm } from '@/components/auth/signin-form'
import { isDefaultAdmin } from '@/lib/admin-default'

export default async function SignInPage() {
  const showDefaultHint = await isDefaultAdmin()
  return <SignInForm showDefaultHint={showDefaultHint} />
}
