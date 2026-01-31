import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendGotifyNotification } from '@/lib/notifications/gotify'

// POST /api/admin/settings/test-gotify
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const title = body.title || '测试推送 - 执笔为剑'
    const message = body.message || '这是一条来自 执笔为剑 的 Gotify 测试通知'
    const priority = typeof body.priority === 'number' ? body.priority : 5

    // 优先从 env 读取
    const bodyUrl = typeof body.url === 'string' ? body.url.trim() : ''
    const bodyToken = typeof body.token === 'string' ? body.token.trim() : ''
    const envUrl = process.env.GOTIFY_URL
    const envToken = process.env.GOTIFY_TOKEN

    let url = bodyUrl || envUrl
    let token = bodyToken || envToken
    let enabled = true

    if (!url || !token) {
      // 从 DB 读取
      const urlSetting = await prisma.setting.findUnique({ where: { key: 'notifications.gotify.url' } })
      const tokenSetting = await prisma.setting.findUnique({ where: { key: 'notifications.gotify.token' } })
      const enabledSetting = await prisma.setting.findUnique({ where: { key: 'notifications.gotify.enabled' } })

      const urlVal = urlSetting?.value as any
      const tokenVal = tokenSetting?.value as any
      const enabledVal = enabledSetting?.value as any

      const getStr = (v: any, k: string) => (v ? (v[k] || v.value || Object.values(v)[0] || '') as string : '')

      url = url || getStr(urlVal, 'url')
      token = token || getStr(tokenVal, 'token')
      
      if (enabledVal) {
        if (typeof enabledVal.enabled === 'boolean') enabled = enabledVal.enabled
        else if (typeof enabledVal.value === 'boolean') enabled = enabledVal.value
        else if (Object.values(enabledVal).length > 0) enabled = Boolean(Object.values(enabledVal)[0])
      }
    }

    if (!enabled) {
      return NextResponse.json({ error: 'Gotify 推送未启用' }, { status: 400 })
    }

    if (!url || !token) {
      const missing = [
        !url ? 'url' : null,
        !token ? 'token' : null,
      ].filter(Boolean).join(' / ')
      return NextResponse.json({ error: `Gotify 配置不完整（缺少 ${missing}）` }, { status: 400 })
    }

    await sendGotifyNotification({ url, token, title, message, priority })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Gotify 测试推送失败:', error)
    return NextResponse.json({ error: (error as any)?.message || '推送失败' }, { status: 500 })
  }
}
