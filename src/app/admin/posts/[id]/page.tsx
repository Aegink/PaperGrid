import { redirect } from 'next/navigation'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // 重定向到编辑器页面,带上 ID
  redirect(`/admin/posts/editor?id=${id}`)
}
