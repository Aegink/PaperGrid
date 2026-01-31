'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CodeCopyButton() {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className="flex items-center rounded-md p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title="复制代码"
      onClick={async (e) => {
        const root = e.currentTarget.closest('[data-code-block]')
        const codeEl = root?.querySelector('code') as HTMLElement | null
        const text = codeEl?.innerText ?? ''
        if (!text) return

        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        } catch {
          // ignore
        }
      }}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-gray-400" />
      )}
    </button>
  )
}

