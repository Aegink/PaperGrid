'use client'

import { X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 shadow-lg backdrop-blur ${
            toast.variant === 'destructive'
              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-900/40 dark:text-red-100'
              : 'border-gray-200 bg-white/90 text-gray-900 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold leading-5">{toast.title}</p>
              )}
              {toast.description && (
                <p className="mt-1 text-sm opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="关闭通知"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
