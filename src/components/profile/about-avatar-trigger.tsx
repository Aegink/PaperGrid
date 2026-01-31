'use client'

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function AboutAvatarTrigger({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const clickCountRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  const handleClick = useCallback(() => {
    clickCountRef.current += 1

    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0
      router.push('/admin')
      return
    }

    timerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0
    }, 800)
  }, [router])

  return (
    <div onClick={handleClick} role="button" aria-label="进入管理后台">
      {children}
    </div>
  )
}
