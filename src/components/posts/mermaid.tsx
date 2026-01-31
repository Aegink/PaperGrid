'use client'

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

interface MermaidProps {
  content: string
}

type MermaidLike = {
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, text: string) => Promise<{ svg: string }>
}

export function Mermaid({ content }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mermaidRef = useRef<MermaidLike | null>(null)
  const [hasError, setHasError] = useState(false)
  const [svgCode, setSvgCode] = useState<string>('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mod = await import('mermaid')
        if (cancelled) return
        const m = ((mod as unknown as { default?: MermaidLike }).default ?? (mod as unknown as MermaidLike))
        mermaidRef.current = m
        m.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        })
        setReady(true)
      } catch (err) {
        console.error('Mermaid load error:', err)
        setHasError(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const mermaid = mermaidRef.current
    if (!mermaid) return

    if (ref.current && content) {
      let cancelled = false
      try {
        setHasError(false)
        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`
        mermaid
          .render(id, content)
          .then(({ svg }: { svg: string }) => {
            if (cancelled) return
            setSvgCode(svg)
            if (ref.current) {
              ref.current.innerHTML = svg
            }
          })
          .catch((err: unknown) => {
            console.error('Mermaid render error:', err)
            setHasError(true)
          })
      } catch (err) {
        console.error('Mermaid initialization error:', err)
        setHasError(true)
      }

      return () => {
        cancelled = true
      }
    }
  }, [content, ready])

  if (hasError) {
    return (
      <pre className="p-4 bg-red-50 text-red-500 rounded-lg overflow-x-auto text-sm">
        <code>{content}</code>
      </pre>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className="flex justify-center my-8 bg-white p-4 rounded-lg overflow-x-auto grayscale dark:invert cursor-zoom-in hover:opacity-90 transition-opacity" 
          ref={ref} 
        />
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] border-none bg-white p-6 shadow-none sm:max-w-[95vw] overflow-auto">
        <DialogTitle className="sr-only">Mermaid Diagram</DialogTitle>
        <div 
          className="flex items-center justify-center min-h-[50vh] w-full"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </DialogContent>
    </Dialog>
  )
}
