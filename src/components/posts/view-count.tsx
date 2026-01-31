'use client'

import { useEffect, useState } from 'react'

export function ViewCount({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    if (!slug) return

    // 同一访客短时间内重复刷新不重复计数，减少写入压力
    const storageKey = `viewed:${slug}`
    const now = Date.now()
    const cooldownMs = 10 * 60 * 1000

    try {
      const last = Number(localStorage.getItem(storageKey) || 0)
      if (Number.isFinite(last) && last > 0 && now - last < cooldownMs) {
        return
      }
      localStorage.setItem(storageKey, String(now))
    } catch {
      // ignore
    }

    fetch('/api/posts/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.count === 'number') {
          setCount(data.count)
        }
      })
      .catch(() => {
        // ignore
      })
  }, [slug])

  return <span>{count}</span>
}

