import { redirect } from 'next/navigation'

export default function NewPostPage() {
  // 重定向到编辑页面(不带 ID 表示新建)
  redirect('/admin/posts/editor')
}
