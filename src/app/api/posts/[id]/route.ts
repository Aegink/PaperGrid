import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { PostStatus } from '@prisma/client'
import readingTime from 'reading-time'

// GET /api/posts/[id] - 获取单个文章
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        postTags: {
          include: {
            tag: true,
          },
        },
        comments: {
          where: {
            status: 'APPROVED',
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    // 管理后台只允许管理员访问

    return NextResponse.json({ post })
  } catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 })
  }
}

// PATCH /api/posts/[id] - 更新文章
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    // 管理后台只允许管理员修改

    const body = await req.json()
    const {
      title,
      content,
      excerpt,
      coverImage,
      status,
      locale,
      categoryId,
      tags,
      createdAt,
    } = body

    const normalizedCategoryId =
      categoryId === '' ? null : categoryId

    const parsedCreatedAt =
      typeof createdAt === 'string' && createdAt.trim().length > 0
        ? new Date(createdAt)
        : null
    if (parsedCreatedAt && Number.isNaN(parsedCreatedAt.getTime())) {
      return NextResponse.json({ error: '创建时间格式错误' }, { status: 400 })
    }

    // 更新文章
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && {
          content,
          readingTime: Math.max(1, Math.round(readingTime(String(content)).minutes)),
        }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(status !== undefined && {
          status,
          publishedAt: status === PostStatus.PUBLISHED && !existingPost.publishedAt
            ? new Date()
            : existingPost.publishedAt,
        }),
        ...(locale !== undefined && { locale }),
        ...(parsedCreatedAt ? { createdAt: parsedCreatedAt } : {}),
        ...(normalizedCategoryId !== undefined && { categoryId: normalizedCategoryId }),
        ...(tags && {
          postTags: {
            deleteMany: {},
            create: tags.map((tagId: string) => ({
              tagId,
            })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 })
  }
}

// DELETE /api/posts/[id] - 删除文章
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    // 管理后台只允许管理员删除

    // 删除文章
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 })
  }
}
