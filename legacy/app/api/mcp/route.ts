import { NextRequest, NextResponse } from 'next/server'

const MCP_SERVER_URL = 'http://127.0.0.1:3845/mcp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      return NextResponse.json(
        {
          error: {
            code: response.status,
            message: errorText || `HTTP error! status: ${response.status}`,
          },
        },
        { status: response.status }
      )
    }

    const text = await response.text()
    
    // 嘗試解析 JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      // 如果是 SSE 格式，提取 data 部分
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            data = JSON.parse(line.substring(6))
            break
          } catch {
            continue
          }
        }
      }
      if (!data) {
        data = { raw: text }
      }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 500,
          message: error.message || 'Internal server error',
        },
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(MCP_SERVER_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      return NextResponse.json(
        {
          error: {
            code: response.status,
            message: errorText || `HTTP error! status: ${response.status}`,
          },
        },
        { status: response.status }
      )
    }

    const text = await response.text()
    
    // 嘗試解析 JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 500,
          message: error.message || 'Internal server error',
        },
      },
      { status: 500 }
    )
  }
}
