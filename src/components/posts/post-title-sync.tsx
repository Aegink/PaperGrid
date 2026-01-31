'use client'

import { useEffect } from 'react'

export function PostTitleSync({ title }: { title: string }) {
  useEffect(() => {
    // We use a custom event to broadcast the title to the Navbar
    const event = new CustomEvent('post-title-changed', { detail: title })
    window.dispatchEvent(event)
    
    // Clear on unmount
    return () => {
      window.dispatchEvent(new CustomEvent('post-title-changed', { detail: '' }))
    }
  }, [title])

  return null
}
