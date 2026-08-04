# mcp-videogames

Videogames MCP — wraps Free-to-Play Games API (freetogame.com, free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `list_games` | List free-to-play games from FreeToGame, optionally filtered by platform (pc/browser) and category (e.g., mmorpg, shooter, strategy) and sorted by release-date, popularity, or alphabetical. Returns all matching games. |
| `get_game` | Get full details for a free-to-play game by its FreeToGame ID. Returns title, description, genre, platform, publisher, developer, release date, screenshots, and minimum system requirements. |
| `filter_games` | Filter free-to-play games on FreeToGame by a dot-separated tag combination (e.g., "3d.mmorpg.fantasy", "shooter.pvp") and optional platform (pc/browser). Returns matching games with title, genre, platform, and release date. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "videogames": {
      "url": "https://gateway.pipeworx.io/videogames/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Videogames data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
