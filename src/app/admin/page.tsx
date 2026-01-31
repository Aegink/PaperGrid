'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Folder, Tag as TagIcon, Eye, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { StatsCard } from '@/components/admin/stats-card'
import { ViewsChart } from '@/components/admin/views-chart'
import { RecentComments, PopularPosts } from '@/components/admin/recent-items'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  posts: {
    total: number
    published: number
    draft: number
    thisWeek: number
  }
  comments: {
    total: number
    pending: number
  }
  categories: number
  tags: number
  views: {
    total: number
    trend: Array<{ date: string; views: number }>
  }
  recentPosts: Array<{
    id: string
    title: string
    slug: string
    createdAt: Date
    viewCount: { count: number | null } | null
  }>
  popularPosts: Array<{
    id: string
    title: string
    slug: string
    viewCount: { count: number | null } | null
  }>
  recentComments: Array<{
    id: string
    content: string
    createdAt: Date
    author: { name: string | null }
    post: { title: string }
  }>
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [defaultAvatarUrl, setDefaultAvatarUrl] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => setDefaultAvatarUrl(data?.['site.defaultAvatarUrl'] || ''))
      .catch((err) => console.error('Failed to load settings', err))
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (response.ok) {
        setStats(data)
      } else {
        setError(data.error || '获取统计数据失败')
      }
    } catch (err) {
      console.error('获取统计数据失败:', err)
      setError('获取统计数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground">欢迎来到您的博客管理后台</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground">欢迎来到您的博客管理后台</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-medium mb-2">加载失败</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={fetchStats}>重试</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
        <p className="text-muted-foreground">
          欢迎回来！这里有您的博客概览
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="总文章数"
          value={stats.posts.total}
          change={stats.posts.thisWeek > 0 ? Math.round((stats.posts.thisWeek / stats.posts.total) * 100) : 0}
          icon={FileText}
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-900/20"
        />
        <StatsCard
          title="已发布"
          value={stats.posts.published}
          icon={TrendingUp}
          color="text-green-600 dark:text-green-400"
          bgColor="bg-green-100 dark:bg-green-900/20"
        />
        <StatsCard
          title="草稿"
          value={stats.posts.draft}
          icon={FileText}
          color="text-yellow-600 dark:text-yellow-400"
          bgColor="bg-yellow-100 dark:bg-yellow-900/20"
        />
        <StatsCard
          title="总阅读量"
          value={stats.views.total.toLocaleString()}
          icon={Eye}
          color="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-100 dark:bg-purple-900/20"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="评论数"
          value={stats.comments.total}
          icon={MessageSquare}
          color="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-100 dark:bg-orange-900/20"
        />
        <StatsCard
          title="待审核"
          value={stats.comments.pending}
          icon={AlertCircle}
          color="text-red-600 dark:text-red-400"
          bgColor="bg-red-100 dark:bg-red-900/20"
        />
        <StatsCard
          title="分类"
          value={stats.categories}
          icon={Folder}
          color="text-cyan-600 dark:text-cyan-400"
          bgColor="bg-cyan-100 dark:bg-cyan-900/20"
        />
        <StatsCard
          title="标签"
          value={stats.tags}
          icon={TagIcon}
          color="text-pink-600 dark:text-pink-400"
          bgColor="bg-pink-100 dark:bg-pink-900/20"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Views Chart */}
        <div className="lg:col-span-2">
          <ViewsChart data={stats.views.trend} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/posts/editor"
              className="block w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              写新文章
            </Link>
            <Link
              href="/admin/comments"
              className="block w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 transition-colors"
            >
              管理评论
              {stats.comments.pending > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {stats.comments.pending}
                </span>
              )}
            </Link>
            <Link
              href="/admin/categories"
              className="block w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 transition-colors"
            >
              管理分类
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items */}
      <div className="grid gap-4 md:grid-cols-2">
        <PopularPosts posts={stats.popularPosts} />
        <RecentComments comments={stats.recentComments} defaultAvatarUrl={defaultAvatarUrl} />
      </div>
    </div>
  )
}
