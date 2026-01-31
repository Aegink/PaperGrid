import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'

export type MarkdownHeading = {
  text: string
  level: number
}

type MdastNode = {
  type: string
  value?: string
  depth?: number
  children?: MdastNode[]
}

function extractText(node: MdastNode | undefined): string {
  if (!node) return ''
  if (typeof node.value === 'string') return node.value
  if (!node.children || node.children.length === 0) return ''
  return node.children.map(extractText).join('')
}

export function extractHeadingsFromMarkdown(markdown: string, maxDepth = 3): MarkdownHeading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as MdastNode
  const headings: MarkdownHeading[] = []

  visit(tree as MdastNode, 'heading', (node: MdastNode) => {
    const depth = typeof node.depth === 'number' ? node.depth : 0
    if (!depth || depth > maxDepth) return
    const text = extractText(node).trim()
    if (!text) return
    headings.push({ text, level: depth })
  })

  return headings
}
