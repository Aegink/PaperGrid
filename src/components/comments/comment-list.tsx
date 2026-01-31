'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface Author {
  name: string | null
  image: string | null
}

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: Author | null
  authorName?: string | null
}

interface CommentListProps {
  postSlug: string
  refreshTrigger?: number
  defaultAvatarUrl?: string
}

export function CommentList({ postSlug, refreshTrigger, defaultAvatarUrl = '' }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 获取评论列表
  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/comments?slug=${postSlug}`)
      const data = await response.json()

      if (response.ok) {
        setComments(data.comments)
      } else if (response.status === 403) {
        setComments([])
      }
    } catch (error) {
      console.error('获取评论失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postSlug, refreshTrigger])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          还没有评论，快来发表第一条评论吧！
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        评论 ({comments.length})
      </h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} defaultAvatarUrl={defaultAvatarUrl} />
        ))}
      </div>
    </div>
  )
}

function CommentItem({ comment, defaultAvatarUrl }: { comment: Comment; defaultAvatarUrl: string }) {
  const displayName = comment.author?.name || comment.authorName || '匿名用户'
  const getInitials = (name: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* 头像 */}
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={comment.author?.image || defaultAvatarUrl || undefined} />
          <AvatarFallback className="border border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-serif">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        {/* 评论内容 */}
        <div className="flex-1 min-w-0">
          {/* 作者名和时间 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {displayName}
            </span>
            <span className="text-gray-400">·</span>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          </div>

          {/* 评论内容 */}
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
      </div>
    </Card>
  )
}
