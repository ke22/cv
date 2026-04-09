// 使用 Next.js API 路由作為代理，避免 CORS 問題
const MCP_SERVER_URL = typeof window !== 'undefined' 
  ? '/api/mcp'  // 瀏覽器環境：使用 API 路由
  : 'http://127.0.0.1:3845/mcp'  // 伺服器環境：直接訪問

export interface MCPRequest {
  method: string
  params?: Record<string, any>
}

export interface MCPResponse {
  success: boolean
  data?: any
  error?: string
}

// 會話管理（Figma MCP 使用 response header mcp-session-id 關聯後續請求）
let sessionId: string | null = null
let requestId = 0

/**
 * 解析 SSE 格式的響應
 */
function parseSSEResponse(text: string): any | null {
  try {
    // 嘗試直接解析 JSON
    return JSON.parse(text)
  } catch {
    // 如果是 SSE 格式，提取 data 部分
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          return JSON.parse(line.substring(6))
        } catch {
          continue
        }
      }
    }
    return null
  }
}

/**
 * 初始化 MCP 會話
 */
async function initializeSession(): Promise<string | null> {
  try {
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {
            roots: { listChanged: true },
            sampling: {},
            tools: {},
          },
          clientInfo: {
            name: 'cv-figma-client',
            version: '1.0.0',
          },
        },
        id: ++requestId,
      }),
    })

    const text = await response.text()
    const data = parseSSEResponse(text)
    
    if (!data) {
      console.error('無法解析響應:', text.substring(0, 100))
      return null
    }
    
    if (data.error) {
      console.error('初始化失敗:', data.error)
      return null
    }
    
    // Figma MCP: 從 response header 取得 session，後續請求需帶上
    const mcpSessionHeader = response.headers.get?.('mcp-session-id')
    if (mcpSessionHeader) sessionId = mcpSessionHeader
    else sessionId = data.result?.sessionId || data.sessionId || 'default'
    
    // MCP spec: after successful initialize, client MUST send notifications/initialized
    const initHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    }
    if (sessionId) initHeaders['mcp-session-id'] = sessionId
    await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: initHeaders,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
      }),
    }).catch(() => {})
    
    return sessionId
  } catch (error: any) {
    console.error('初始化會話錯誤:', error)
    return null
  }
}

/**
 * 測試 MCP 伺服器連接
 */
export async function testMCPConnection(): Promise<MCPResponse> {
  try {
    // 先嘗試初始化會話
    const sid = await initializeSession()
    
    if (!sid) {
      // 如果初始化失敗，嘗試直接連接
      const response = await fetch(MCP_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {
              roots: { listChanged: true },
              sampling: {},
              tools: {},
            },
            clientInfo: {
              name: 'cv-figma-client',
              version: '1.0.0',
            },
          },
          id: ++requestId,
        }),
      })

      const text = await response.text()
      const data = parseSSEResponse(text)
      
      if (!data) {
        return {
          success: false,
          error: `無法解析伺服器響應: ${text.substring(0, 200)}`,
        }
      }
      
      if (data.error) {
        return {
          success: false,
          error: `MCP 伺服器錯誤: ${data.error.message || JSON.stringify(data.error)}`,
        }
      }
      
      sessionId = data.result?.sessionId || data.sessionId || 'default'
      
      return {
        success: true,
        data: {
          status: response.status,
          sessionId: sessionId,
          message: 'MCP 伺服器連接成功',
          serverInfo: data.result,
        },
      }
    }
    
    return {
      success: true,
      data: {
        sessionId: sid,
        message: 'MCP 伺服器連接成功',
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '無法連接到 MCP 伺服器',
    }
  }
}

/**
 * 發送 MCP 請求
 */
export async function sendMCPRequest(request: MCPRequest): Promise<MCPResponse> {
  try {
    // 確保會話已初始化
    if (!sessionId) {
      const sid = await initializeSession()
      if (!sid) {
        return {
          success: false,
          error: '無法初始化 MCP 會話',
        }
      }
    }

    // MCP 協議使用 JSON-RPC 2.0 格式
    const mcpRequest: any = {
      jsonrpc: '2.0',
      method: request.method,
      params: request.params || {},
      id: ++requestId,
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    }
    if (sessionId) headers['mcp-session-id'] = sessionId

    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(mcpRequest),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const text = await response.text()
    const data = parseSSEResponse(text)
    
    if (!data) {
      return {
        success: false,
        error: `無法解析伺服器響應: ${text.substring(0, 200)}`,
      }
    }
    
    // 處理 JSON-RPC 響應
    if (data.error) {
      // 如果是會話錯誤，嘗試重新初始化
      if (data.error.code === -32001 || data.error.message?.includes('sessionId')) {
        sessionId = null
        const sid = await initializeSession()
        if (sid) {
          // 重試請求
          return sendMCPRequest(request)
        }
      }
      
      return {
        success: false,
        error: data.error.message || JSON.stringify(data.error),
      }
    }
    
    return {
      success: true,
      data: data.result || data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'MCP 請求失敗',
    }
  }
}

/**
 * 從 Figma 提取框架設計（使用已建立的 MCP 會話）
 */
export async function extractFigmaFrame(frameId: string) {
  const fileKey = 'aF2rorNQMJ67rCHFbq6XCk'
  // Figma MCP 工具名稱: get_design_context；參數為 nodeId + fileKey（或 file_key）
  const toolCalls: Array<{ name: string; args: Record<string, string> }> = [
    { name: 'get_design_context', args: { nodeId: frameId, fileKey } },
    { name: 'get_design_context', args: { node_id: frameId, file_key: fileKey } },
  ]

  for (const { name, args } of toolCalls) {
    const result = await sendMCPRequest({
      method: 'tools/call',
      params: {
        name,
        arguments: args,
      },
    })
    if (result.success && result.data) {
      const content = result.data.content ?? result.data
      return { success: true, data: content }
    }
  }

  return {
    success: false,
    error: '所有調用方式都失敗了，請檢查 MCP 伺服器配置與工具名稱',
  }
}

/**
 * 列出可用的 MCP 工具
 */
export async function listMCPTools() {
  return sendMCPRequest({
    method: 'tools/list',
  })
}

/**
 * 提取 Figma 變數（顏色、字體等）
 */
export async function extractFigmaVariables(fileKey: string) {
  return sendMCPRequest({
    method: 'figma_get_variables',
    params: {
      fileKey,
    },
  })
}

/**
 * 提取 Figma 組件
 */
export async function extractFigmaComponents(fileKey: string) {
  return sendMCPRequest({
    method: 'figma_get_components',
    params: {
      fileKey,
    },
  })
}
