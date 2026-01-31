'use client'

import { useEffect, useMemo, useState } from 'react'

export function AdminLoadingFallback({ delayMs = 150 }: { delayMs?: number }) {
  const minDisplayMs = 500
  const [visible, setVisible] = useState(false)
  const [hold, setHold] = useState(true)
  const [startedAt] = useState(() => Date.now())
  const [doneAt] = useState(() => startedAt + minDisplayMs)
  const showAt = useMemo(() => startedAt + delayMs, [startedAt, delayMs])

  useEffect(() => {
    const now = Date.now()
    const showDelay = Math.max(0, showAt - now)
    const holdDelay = Math.max(0, doneAt - now)

    const showTimer = setTimeout(() => setVisible(true), showDelay)
    const holdTimer = setTimeout(() => setHold(false), holdDelay)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(holdTimer)
    }
  }, [showAt, doneAt])

  if (!visible) return null

  return (
    <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
      加载中...
      {hold && <span className="sr-only">loading-hold</span>}
    </div>
  )
}
