'use client'

import Image from 'next/image'
import { ComponentProps } from 'react'
import { ZoomableImage } from '@/components/ui/zoomable-image'

export const mdxComponents = {
  h1: ({ className, ...props }: ComponentProps<'h1'>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 border-b pb-2" {...props} />
  ),
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-1" {...props} />
  ),
  h3: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3 className="text-xl font-bold mt-6 mb-3" {...props} />
  ),
  h4: ({ className, ...props }: ComponentProps<'h4'>) => (
    <h4 className="text-lg font-bold mt-4 mb-2" {...props} />
  ),
  p: ({ className, ...props }: ComponentProps<'p'>) => (
    <p className="my-3 leading-relaxed text-[15px] sm:text-base text-gray-800 dark:text-gray-200" {...props} />
  ),
  a: ({ className, ...props }: ComponentProps<'a'>) => (
    <a className="text-blue-600 hover:underline dark:text-blue-400 font-medium" {...props} />
  ),
  ul: ({ className, ...props }: ComponentProps<'ul'>) => (
    <ul className="list-disc pl-6 my-3 space-y-1.5 text-[15px] sm:text-base" {...props} />
  ),
  ol: ({ className, ...props }: ComponentProps<'ol'>) => (
    <ol className="list-decimal pl-6 my-3 space-y-1.5 text-[15px] sm:text-base" {...props} />
  ),
  li: ({ className, ...props }: ComponentProps<'li'>) => (
    <li className="my-0.5" {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-700 dark:border-gray-600 dark:text-gray-300 my-4"
      {...props}
    />
  ),
  pre: ({ className, ...props }: ComponentProps<'pre'>) => (
    <pre className={`m-0 p-0 bg-transparent border-none outline-none shadow-none ${className || ''}`} {...props} />
  ),
  code: ({ className, ...props }: ComponentProps<'code'>) => {
    // 检查是否在代码块内部使用（通过类名判断）
    const isInline = !className || !className.includes('language-')
    
    if (!isInline) {
      return <code className={className} {...props} />
    }

    return (
      <code
        className={`mx-1 rounded-md bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[0.85em] font-mono text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 font-medium ${className || ''}`}
        {...props}
      />
    )
  },
  img: ({ className, src, alt, ...props }: ComponentProps<'img'>) => {
    const safeSrc = typeof src === 'string' ? src : ''

    return (
      <ZoomableImage
        className="rounded-lg my-4 h-auto w-full object-cover"
        src={safeSrc}
        alt={alt}
        {...props}
      />
    )
  },
  hr: ({ ...props }) => <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />,
  table: ({ className, ...props }: ComponentProps<'table'>) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: ({ className, ...props }: ComponentProps<'thead'>) => (
    <thead className="bg-gray-100 dark:bg-gray-800/50" {...props} />
  ),
  tbody: ({ className, ...props }: ComponentProps<'tbody'>) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-800" {...props} />
  ),
  tr: ({ className, ...props }: ComponentProps<'tr'>) => (
    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors" {...props} />
  ),
  th: ({ className, ...props }: ComponentProps<'th'>) => (
    <th
      className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white"
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentProps<'td'>) => (
    <td
      className="px-4 py-3 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
}
