# @pipeworx/mcp-videogames

MCP server for free-to-play video game data from FreeToGame

## Tools

| Tool | Description |
|------|-------------|
| `list_games` | List free-to-play games with optional platform/category/sort filters |
| `get_game` | Get full game details by FreeToGame ID |
| `filter_games` | Filter games by tag and optional platform |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "list_games",
      "arguments": { "category": "mmorpg", "sort_by": "popularity" }
    }
  }'
```

## License

MIT
