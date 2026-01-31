'use client'

import { useEffect, useState, useRef } from 'react'

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)

      // 显示进度条并触发动画
      setIsVisible(true)
      setIsAnimating(true)

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 3秒后隐藏
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        setIsAnimating(false)
      }, 3000)
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'h-1.5' : 'h-0'
      }`}
    >
      <div
        className={`h-full transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg,
            #9ca3af 0%,
            #d1d5db 25%,
            #f9fafb 50%,
            #d1d5db 75%,
            #9ca3af 100%)`,
          backgroundSize: '200% 100%',
          animation: isVisible ? 'gradient-shift 8s linear infinite' : 'none',
        }}
      />
      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}
