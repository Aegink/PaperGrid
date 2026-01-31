import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const API_KEY_PREFIX = 'eak_'

export type ApiKeyPermission =
  | 'POST_CREATE'
  | 'POST_UPDATE'
  | 'POST_DELETE'
  | 'POST_READ'

export const API_KEY_PERMISSION_LIST: ApiKeyPermission[] = [
  'POST_CREATE',
  'POST_UPDATE',
  'POST_DELETE',
  'POST_READ',
]

export function generateApiKey(): string {
  const raw = crypto.randomBytes(32).toString('base64url')
  return `${API_KEY_PREFIX}${raw}`
}

export function hashApiKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey).digest('hex')
}

export function extractApiKey(request: Request): string | null {
  const headerKey = request.headers.get('x-api-key') || request.headers.get('X-API-Key')
  if (headerKey) return headerKey.trim()

  const auth = request.headers.get('authorization') || request.headers.get('Authorization')
  if (!auth) return null
  const [type, token] = auth.split(' ')
  if (type?.toLowerCase() === 'bearer' && token) {
    return token.trim()
  }
  return null
}

export function hasApiKeyPermissions(
  permissions: ApiKeyPermission[],
  required: ApiKeyPermission | ApiKeyPermission[]
) {
  const requiredList = Array.isArray(required) ? required : [required]
  return requiredList.every((perm) => permissions.includes(perm))
}

export async function requireApiKey(
  request: Request,
  required?: ApiKeyPermission | ApiKeyPermission[]
) {
  const rawKey = extractApiKey(request)
  if (!rawKey) {
    return { ok: false, status: 401, error: '缺少 API Key' }
  }

  const keyHash = hashApiKey(rawKey)
  const apiKey = await prisma.apiKey.findUnique({ where: { keyHash } })

  if (!apiKey || !apiKey.enabled) {
    return { ok: false, status: 401, error: '无效 API Key' }
  }

  const storedPermissions = Array.isArray(apiKey.permissions)
    ? (apiKey.permissions.filter((p) => typeof p === 'string') as ApiKeyPermission[])
    : []

  if (required && !hasApiKeyPermissions(storedPermissions, required)) {
    return { ok: false, status: 403, error: '权限不足' }
  }

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  })

  return { ok: true, apiKey: { ...apiKey, permissions: storedPermissions } }
}

export function getPermissionLabels() {
  return {
    POST_READ: '查询文章',
    POST_CREATE: '增加文章',
    POST_UPDATE: '修改文章',
    POST_DELETE: '删除文章',
  } as Record<ApiKeyPermission, string>
}
