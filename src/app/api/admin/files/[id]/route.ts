import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { mediaUrlById, resolveMediaPath } from '@/lib/media'
import { unlink } from 'node:fs/promises'

export const runtime = 'nodejs'

const SETTING_KEYS = ['site.logoUrl', 'site.faviconUrl', 'site.defaultAvatarUrl']

function unwrapSettingValue(value: unknown): unknown {
  if (!value || typeof value !== 'object') return undefined
  const values = Object.values(value as Record<string, unknown>)
  return values.length > 0 ? values[0] : undefined
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params
    const media = await prisma.mediaFile.findUnique({
      where: { id },
      select: {
        id: true,
        storagePath: true,
      },
    })

    if (!media) {
      return NextResponse.json({ error: '文件不存在' }, { status: 404 })
    }

    const url = mediaUrlById(media.id)
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === '1'

    const [postCount, projectCount, userCount, settingRows] = await Promise.all([
      prisma.post.count({ where: { coverImage: url } }),
      prisma.project.count({ where: { image: url } }),
      prisma.user.count({ where: { image: url } }),
      prisma.setting.findMany({
        where: { key: { in: SETTING_KEYS } },
        select: { key: true, value: true },
      }),
    ])

    const settingUsage = settingRows.filter((row) => unwrapSettingValue(row.value) === url)
    const totalRefs = postCount + projectCount + userCount + settingUsage.length

    if (!force && totalRefs > 0) {
      return NextResponse.json(
        {
          error: '该图片仍在服务站点内容，建议先替换引用后再删除',
          references: {
            posts: postCount,
            projects: projectCount,
            users: userCount,
            settings: settingUsage.map((item) => item.key),
            total: totalRefs,
          },
        },
        { status: 409 }
      )
    }

    await prisma.mediaFile.delete({ where: { id } })

    const absolutePath = resolveMediaPath(media.storagePath)
    try {
      await unlink(absolutePath)
    } catch (error) {
      const err = error as NodeJS.ErrnoException
      if (err.code !== 'ENOENT') {
        console.error('删除本地文件失败:', err)
      }
    }

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除文件失败:', error)
    return NextResponse.json({ error: '删除文件失败' }, { status: 500 })
  }
}
