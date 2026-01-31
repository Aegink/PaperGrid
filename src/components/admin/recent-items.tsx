import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    name: string | null
  } | null
  authorName?: string | null
  post: {
    title: string
  }
}

interface Post {
  id: string
  title: string
  slug: string
  viewCount: {
    count: number | null
  } | null
}

interface RecentCommentsProps {
  comments: Comment[]
  defaultAvatarUrl?: string
}

export function RecentComments({ comments, defaultAvatarUrl }: RecentCommentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          最新评论
        </CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            暂无评论
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-sm">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={defaultAvatarUrl || undefined} />
                  <AvatarFallback className="border border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-serif text-xs">
                    {(comment.author?.name || comment.authorName || '匿名用户').charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.author?.name || comment.authorName || '匿名用户'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {comment.content}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    文章: {comment.post.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface PopularPostsProps {
  posts: Post[]
}

export function PopularPosts({ posts }: PopularPostsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          热门文章
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            暂无文章
          </p>
        ) : (
          <div className="space-y-3">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="block group"
              >
                <div className="flex items-start gap-3 text-sm p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-serif font-bold shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Eye className="h-3 w-3" />
                      <span>{post.viewCount?.count || 0} 次阅读</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
