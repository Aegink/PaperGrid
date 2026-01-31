import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

process.chdir(root)

if (process.env.SKIP_DB_PREPARE === '1') {
  console.log('[db:prepare] SKIP_DB_PREPARE=1, skipping.')
  process.exit(0)
}

const envPath = resolve(root, '.env')
const envExamplePath = resolve(root, '.env.example')

if (!existsSync(envPath) && existsSync(envExamplePath)) {
  copyFileSync(envExamplePath, envPath)
  console.log('[db:prepare] .env not found, copied from .env.example.')
}

const envContent = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''
const match = envContent.match(/^\s*DATABASE_URL\s*=\s*['"]?([^'"\n]+)['"]?/m)
const databaseUrl = match?.[1]?.trim()

if (!databaseUrl) {
  console.log('[db:prepare] DATABASE_URL not set, skipping.')
  process.exit(0)
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })

try {
  run('pnpm prisma generate')
  run('pnpm prisma migrate deploy')
  if (process.env.SKIP_DB_SEED !== '1') {
    run('pnpm prisma db seed')
  } else {
    console.log('[db:prepare] SKIP_DB_SEED=1, skip seeding.')
  }
} catch (error) {
  console.error('[db:prepare] Failed to prepare database.')
  process.exit(1)
}
