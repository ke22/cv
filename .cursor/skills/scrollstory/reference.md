# Scroll Story — Reference

## GSAP MCP (Optional)

For precise GSAP Timeline and ScrollTrigger code, use the **GSAP Master MCP Server** when available.

- **Repo**: `bruzethegreat/gsap-master-mcp-server`
- **Cursor**: Add MCP server in Cursor settings (e.g. MCP / Integrations). Example config shape (confirm in Cursor docs):

```json
{
  "mcpServers": {
    "gsap-master": {
      "command": "npx",
      "args": ["bruzethegreat-gsap-master-mcp-server@latest"]
    }
  }
}
```

- **Claude CLI**: `claude mcp add-json gsap-master '{"command":"npx","args":["bruzethegreat-gsap-master-mcp-server@latest"]}'`

With the MCP enabled, ask in natural language (e.g. "when I scroll, make the text break apart and fly away") to get Timeline + ScrollTrigger code.

## Project Files

| File | Purpose |
|------|---------|
| `learn-scrollstory/PLAN.md` | Full vanilla scroll-story spec + vibe coding + appendices |
| `learn-scrollstory/index.html` | Vanilla demo structure |
| `SCROLLYTELLING_GUIDE.md` | React/Next components, parallax, kinetic typography |
| `SCROLLYTELLING_COMPONENTS.md` | Component list and usage |
| `cv.html` | Full scroll-scrub portfolio (multiple sections, inline JS) |
