export interface ArchivePostNode {
  id: string
  title: string
  slug: string
}

export interface ArchiveMonthNode {
  month: number
  postCount: number
}

export interface ArchiveYearNode {
  year: number
  postCount: number
  months: ArchiveMonthNode[]
}

export interface ArchiveMonthPage {
  posts: ArchivePostNode[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
