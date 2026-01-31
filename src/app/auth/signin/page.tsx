import { SignInForm } from '@/components/auth/signin-form'
import { isDefaultAdmin } from '@/lib/admin-default'
import { getSetting } from '@/lib/settings'

export default async function SignInPage() {
  const [defaultAdmin, showDefaultHintSetting] = await Promise.all([
    isDefaultAdmin(),
    getSetting<boolean>('ui.showDefaultAdminHint', true),
  ])
  const showDefaultHint = defaultAdmin && (showDefaultHintSetting ?? true)
  return <SignInForm showDefaultHint={showDefaultHint} />
}
