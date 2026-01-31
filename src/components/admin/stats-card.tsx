import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  color: string
  bgColor: string
}

export function StatsCard({ title, value, change, icon: Icon, color, bgColor }: StatsCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
            {change !== undefined && (
              <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}
                {change}% 较上周
              </p>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColor} transition-transform duration-300 hover:scale-110`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
