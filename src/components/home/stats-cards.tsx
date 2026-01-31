import { prisma } from '@/lib/prisma'
import { FileText, Eye, Tag as TagIcon, Folder } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export async function StatsCards() {
  // 获取统计数据
  const [postsCount, categoriesCount, tagsCount, totalViews] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.viewCount.aggregate({
      _sum: {
        count: true,
      },
    }),
  ])

  const stats = [
    {
      title: '文章总数',
      value: postsCount,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: '分类数量',
      value: categoriesCount,
      icon: Folder,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: '标签数量',
      value: tagsCount,
      icon: TagIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: '总阅读量',
      value: totalViews._sum.count || 0,
      icon: Eye,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="group overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 dark:from-gray-800 dark:to-gray-900"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
