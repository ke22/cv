import {
  testMCPConnection,
  listMCPTools,
  extractFigmaFrame,
} from '../lib/figma-mcp-client'

async function main() {
  console.log('🔍 開始測試 MCP 連接...\n')

  // 1. 測試連接
  console.log('1️⃣ 測試 MCP 伺服器連接...')
  const connectionTest = await testMCPConnection()
  if (connectionTest.success) {
    console.log('✅ 連接成功！')
    console.log(JSON.stringify(connectionTest.data, null, 2))
  } else {
    console.warn('⚠️  初始化失敗:', connectionTest.error)
    console.log('繼續嘗試直接提取框架...')
  }

  console.log('\n')

  // 2. 列出可用工具
  console.log('2️⃣ 列出可用工具...')
  const tools = await listMCPTools()
  if (tools.success) {
    console.log('✅ 可用工具:')
    console.log(JSON.stringify(tools.data, null, 2))
  } else {
    console.error('❌ 獲取工具列表失敗:', tools.error)
    console.log('這可能是正常的，取決於 MCP 伺服器的實作方式')
  }

  console.log('\n')

  // 3. 測試提取框架（如果有 Frame ID）
  const frameId = process.argv[2]
  if (frameId) {
    console.log(`3️⃣ 提取 Figma 框架: ${frameId}...`)
    const frame = await extractFigmaFrame(frameId)
    if (frame.success) {
      console.log('✅ 框架數據:')
      console.log(JSON.stringify(frame.data, null, 2))
    } else {
      console.error('❌ 提取框架失敗:', frame.error)
    }
  } else {
    console.log('3️⃣ 跳過框架提取（未提供 Frame ID）')
    console.log('   使用方法: npm run test-mcp <frame-id>')
    console.log('   例如: npm run test-mcp "123:456"')
  }

  console.log('\n✅ 測試完成！')
}

main().catch((error) => {
  console.error('❌ 發生錯誤:', error)
  process.exit(1)
})
