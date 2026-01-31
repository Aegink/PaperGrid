export type GotifyOptions = {
  url: string
  token: string
  title?: string
  message?: string
  priority?: number
}

export async function sendGotifyNotification(options: GotifyOptions) {
  const { url, token, title = '测试推送', message = '这是来自 papergrid 的测试推送', priority = 5 } = options

  if (!url || !token) {
    throw new Error('Gotify URL 或 Token 不存在')
  }

  const baseUrl = url.replace(/\/$/, '')
  const endpoint = `${baseUrl}/message?token=${encodeURIComponent(token)}`

  const payload = {
    title,
    message,
    priority,
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Gotify 推送失败: ${res.status} ${res.statusText} ${text}`)
  }

  return res.json().catch(() => ({ status: 'ok' }))
}
