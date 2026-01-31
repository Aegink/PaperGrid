import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const settings = [
    { 
      key: 'site.footer_icp', 
      value: { value: '蜀ICP备2000000号-1' }, 
      group: 'site', 
      editable: true,
      description: '备案号'
    },
    { 
      key: 'site.footer_copyright', 
      value: { value: '© 2026 千叶. All Rights Reserved. / RSS / Sitemap' }, 
      group: 'site', 
      editable: true,
      description: '版权信息'
    },
    { 
      key: 'site.footer_powered_by', 
      value: { value: 'Powered by XYWML' }, 
      group: 'site', 
      editable: true,
      description: '驱动自'
    }
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    })
    console.log(`✅ Processed setting: ${s.key}`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
