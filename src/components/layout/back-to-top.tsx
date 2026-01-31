'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

import { FloatingActions } from '@/components/layout/floating-actions'
import { usePathname } from 'next/navigation'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    const handleScroll = () => {
      // 显示按钮
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 3秒后隐藏按钮
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 3000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {/* Frontend: show unified FloatingActions (includes menu button on mobile) */}
      {!isAdmin && <FloatingActions visible={isVisible} />}

      {/* Admin or fallback: keep the original single back-to-top button (visibility controlled) */}
      {isAdmin && (
        <Button
          onClick={scrollToTop}
          className={cn(
            'fixed bottom-8 right-8 z-50 rounded-full p-3 shadow-lg transition-all duration-300',
            'hover:scale-110 active:scale-95 text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800',
            isVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          )}
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}
