'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <div
      key={pathname}
      className={isHome || isAdmin ? "" : "animate-page-up"}
    >
      {children}
    </div>
  )
}
