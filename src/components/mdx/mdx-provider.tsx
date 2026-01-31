'use client'

import { MDXProvider as BaseMDXProvider } from '@mdx-js/react'
import { mdxComponents } from './mdx-components'

interface MDXProviderProps {
  children: React.ReactNode
}

export function MDXProvider({ children }: MDXProviderProps) {
  return <BaseMDXProvider components={mdxComponents}>{children}</BaseMDXProvider>
}
