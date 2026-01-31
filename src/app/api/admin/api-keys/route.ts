import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { ApiKeyPermission } from '@/lib/api-keys'
import { API_KEY_PERMISSION_LIST, generateApiKey, hashApiKey } from '@/lib/api-keys'

function normalizePermissions(input: unknown) {
  const allowed = new Set(API_KEY_PERMISSION_LIST)
  if (!Array.isArray(input)) return []
  return input.filter((p) => typeof p === 'string' && allowed.has(p as ApiKeyPermission)) as ApiKeyPermission[]
}

// GET /api/admin/api-keys - 获取 API Key 列表
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        enabled: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ apiKeys })
  } catch (error) {
    console.error('获取 API Key 失败:', error)
    return NextResponse.json({ error: '获取 API Key 失败' }, { status: 500 })
  }
}

// POST /api/admin/api-keys - 创建 API Key
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const name = typeof body.name === 'string' && body.name.trim().length > 0
      ? body.name.trim()
      : `API Key ${new Date().toISOString()}`
    const permissions = normalizePermissions(body.permissions)
    const enabled = typeof body.enabled === 'boolean' ? body.enabled : true

    const rawKey = generateApiKey()
    const keyHash = hashApiKey(rawKey)
    const keyPrefix = rawKey.slice(0, 8)

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        keyHash,
        keyPrefix,
        permissions: permissions.length > 0 ? permissions : ['POST_READ'],
        enabled,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        enabled: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ apiKey, plainKey: rawKey }, { status: 201 })
  } catch (error) {
    console.error('创建 API Key 失败:', error)
    return NextResponse.json({ error: '创建 API Key 失败' }, { status: 500 })
  }
}
