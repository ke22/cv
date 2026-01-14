'use client'

import { useState } from 'react'
import {
  testMCPConnection,
  extractFigmaFrame,
  listMCPTools,
  extractFigmaVariables,
} from '@/lib/figma-mcp-client'

export default function TestMCPPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [frameId, setFrameId] = useState('')
  const [fileKey, setFileKey] = useState('')

  const handleTestConnection = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await testMCPConnection()
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error || '連接失敗')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleListTools = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await listMCPTools()
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error || '獲取工具列表失敗')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExtractFrame = async () => {
    if (!frameId.trim()) {
      setError('請輸入 Figma Frame ID')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await extractFigmaFrame(frameId)
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error || '提取框架失敗')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExtractVariables = async () => {
    if (!fileKey.trim()) {
      setError('請輸入 Figma File Key')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await extractFigmaVariables(fileKey)
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error || '提取變數失敗')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-text-dark">
          MCP Figma 連接測試
        </h1>

        {/* 測試按鈕組 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {loading ? '測試中...' : '1. 測試連接'}
          </button>

          <button
            onClick={handleListTools}
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? '載入中...' : '2. 列出可用工具'}
          </button>

          <div className="flex gap-2">
            <input
              type="text"
              value={fileKey}
              onChange={(e) => setFileKey(e.target.value)}
              placeholder="輸入 Figma File Key"
              className="flex-1 px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleExtractVariables}
              disabled={loading || !fileKey.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '載入中...' : '3. 提取變數'}
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={frameId}
              onChange={(e) => setFrameId(e.target.value)}
              placeholder="輸入 Figma Frame ID (例如: 123:456)"
              className="flex-1 px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleExtractFrame}
              disabled={loading || !frameId.trim()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '載入中...' : '4. 提取框架'}
            </button>
          </div>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg">
            <h3 className="font-bold text-red-800 mb-2">錯誤</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 結果顯示 */}
        {result && (
          <div className="bg-base-light p-6 rounded-xl border-2 border-border">
            <h3 className="text-xl font-bold mb-4 text-text-dark">結果</h3>
            <pre className="bg-base p-4 rounded-lg overflow-auto max-h-96 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* 使用說明 */}
        <div className="mt-8 p-6 bg-base-light rounded-xl">
          <h3 className="text-xl font-bold mb-4 text-text-dark">使用說明</h3>
          <ol className="list-decimal list-inside space-y-2 text-text-light">
            <li>
              <strong>測試連接</strong>：檢查 MCP 伺服器是否運行正常
            </li>
            <li>
              <strong>列出可用工具</strong>：查看 MCP 伺服器提供的所有工具
            </li>
            <li>
              <strong>提取 Figma 變數</strong>：從 Figma 檔案提取顏色、字體等變數（需要 File Key）
            </li>
            <li>
              <strong>提取框架</strong>：輸入 Figma Frame ID 提取完整設計數據
            </li>
          </ol>
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>提示</strong>：Figma Frame ID 可以從 Figma URL 中獲取。
              <br />
              例如：<code className="bg-white px-2 py-1 rounded">figma.com/file/xxx/...?node-id=123:456</code>
              <br />
              Frame ID 就是 <code className="bg-white px-2 py-1 rounded">123:456</code>
              <br />
              <br />
              File Key 是 Figma URL 中的檔案 ID，例如：<code className="bg-white px-2 py-1 rounded">figma.com/file/abc123/...</code>
              <br />
              File Key 就是 <code className="bg-white px-2 py-1 rounded">abc123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
