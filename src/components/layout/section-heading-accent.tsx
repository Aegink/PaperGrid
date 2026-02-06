import { cn } from '@/lib/utils'

export function SectionHeadingAccent({ className }: { className?: string }) {
  return (
    <div className={cn('relative mx-auto mb-6 h-3 w-16', className)}>
      <span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-900/30 dark:bg-white/40" />
    </div>
  )
}
