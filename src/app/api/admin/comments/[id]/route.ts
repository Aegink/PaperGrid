import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/comments/[id] - 更新评论状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['APPROVED', 'PENDING', 'SPAM', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: '无效的状态值' }, { status: 400 })
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('更新评论失败:', error)
    return NextResponse.json({ error: '更新评论失败' }, { status: 500 })
  }
}

// DELETE /api/admin/comments/[id] - 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params

    await prisma.comment.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除评论失败:', error)
    return NextResponse.json({ error: '删除评论失败' }, { status: 500 })
  }
}
