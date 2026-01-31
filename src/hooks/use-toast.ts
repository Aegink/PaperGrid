import { useCallback, useEffect, useState } from 'react'

export interface Toast {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastCount = 0
let toastState: Array<Toast & { id: number }> = []
const listeners = new Set<(toasts: Array<Toast & { id: number }>) => void>()

const notify = () => {
  for (const listener of listeners) {
    listener(toastState)
  }
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<Toast & { id: number }>>(toastState)

  useEffect(() => {
    listeners.add(setToasts)
    return () => {
      listeners.delete(setToasts)
    }
  }, [])

  const toast = useCallback(({ title, description, variant = 'default' }: Toast) => {
    const id = toastCount++
    const newToast = { id, title, description, variant }

    toastState = [...toastState, newToast]
    notify()

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      toastState = toastState.filter((t) => t.id !== id)
      notify()
    }, 3000)

    return id
  }, [])

  const dismiss = useCallback((id: number) => {
    toastState = toastState.filter((t) => t.id !== id)
    notify()
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}
