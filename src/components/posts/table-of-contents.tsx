"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface HeadingItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef<HTMLAnchorElement | null>(null)

  const getActiveId = () => {
    if (!headings || headings.length === 0) return ''
    const offset = 120
    let currentId = headings[0]?.id || ''
    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (!el) continue
      const top = el.getBoundingClientRect().top
      if (top - offset <= 0) {
        currentId = heading.id
      } else {
        break
      }
    }
    return currentId
  }

  useEffect(() => {
    if (!headings || headings.length === 0) return

    let ticking = false
    const update = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        setActiveId(getActiveId())
        ticking = false
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [headings])

  useEffect(() => {
    if (!activeId || !containerRef.current || !activeRef.current) return
    const container = containerRef.current
    const activeItem = activeRef.current
    const relativeTop = activeItem.offsetTop - container.offsetTop
    const isVisible =
      relativeTop >= container.scrollTop &&
      relativeTop <= container.scrollTop + container.offsetHeight - activeItem.offsetHeight

    if (!isVisible) {
      container.scrollTo({
        top: activeItem.offsetTop - container.offsetHeight / 2,
        behavior: 'smooth',
      })
    }
  }, [activeId])

  if (!headings || headings.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">目录</h3>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="h-[400px] overflow-y-auto scroll-smooth custom-scrollbar">
          <nav className="space-y-2 pr-4">
            {headings.map((heading) => (
              <a
                key={heading.id}
                ref={activeId === heading.id ? activeRef : null}
                href={`#${heading.id}`}
                className={cn(
                  'block text-sm transition-all hover:text-blue-600 dark:hover:text-blue-400',
                  activeId === heading.id
                    ? 'text-blue-600 dark:text-blue-400 font-medium translate-x-1'
                    : 'text-gray-600 dark:text-gray-400',
                  heading.level === 1 ? 'pl-0' : heading.level === 2 ? 'pl-4' : 'pl-8'
                )}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  )
}

