/**
 * Videogames MCP — wraps Free-to-Play Games API (freetogame.com, free, no auth)
 *
 * Tools:
 * - list_games: List free-to-play games with optional platform/category/sort filters
 * - get_game: Get full game details by ID
 * - filter_games: Filter games by tag and optional platform
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://www.freetogame.com/api';

// ── API types ─────────────────────────────────────────────────────────

type GameListItem = {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
};

type Screenshot = {
  id: number;
  image: string;
};

type SystemRequirements = {
  os: string | null;
  processor: string | null;
  memory: string | null;
  graphics: string | null;
  storage: string | null;
} | null;

type GameDetail = GameListItem & {
  description: string;
  screenshots: Screenshot[];
  minimum_system_requirements: SystemRequirements;
};

// ── Tool definitions ──────────────────────────────────────────────────

const tools: McpToolExport['tools'] = [
  {
    name: 'list_games',
    description:
      'List free-to-play games from FreeToGame. Optionally filter by platform and category, and sort results. Returns title, short description, game URL, genre, platform, publisher, release date, and thumbnail.',
    inputSchema: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          description: 'Platform filter: "pc", "browser", or "all" (default "all")',
        },
        category: {
          type: 'string',
          description:
            'Genre/category filter, e.g. "mmorpg", "shooter", "strategy", "moba", "racing", "sports", "social", "sandbox", "open-world", "survival", "pvp", "pve", "pixel", "voxel", "zombie", "turn-based", "first-person", "third-person", "top-down", "tower-defense", "horror", "mmofps"',
        },
        sort_by: {
          type: 'string',
          description:
            'Sort order: "release-date", "popularity", "alphabetical", or "relevance"',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_game',
    description:
      'Get full details for a free-to-play game by its FreeToGame ID. Returns title, description, genre, platform, publisher, developer, release date, screenshots, and minimum system requirements.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'FreeToGame game ID (e.g. 452 for "Valorant")',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'filter_games',
    description:
      'Filter free-to-play games by tag (dot-separated combination of attributes). Returns matching games with title, short description, genre, platform, publisher, release date, and thumbnail.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description:
            'Dot-separated tag filter, e.g. "3d.mmorpg.fantasy", "shooter.pvp", "browser.strategy"',
        },
        platform: {
          type: 'string',
          description: 'Optional platform filter: "pc" or "browser"',
        },
      },
      required: ['tag'],
    },
  },
];

// ── callTool dispatcher ───────────────────────────────────────────────

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list_games':
      return listGames(
        args.platform as string | undefined,
        args.category as string | undefined,
        args.sort_by as string | undefined,
      );
    case 'get_game':
      return getGame(args.id as number);
    case 'filter_games':
      return filterGames(args.tag as string, args.platform as string | undefined);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────

function formatGameListItem(game: GameListItem) {
  return {
    id: game.id,
    title: game.title,
    short_description: game.short_description,
    game_url: game.game_url,
    genre: game.genre,
    platform: game.platform,
    publisher: game.publisher,
    release_date: game.release_date,
    thumbnail: game.thumbnail,
  };
}

// ── Tool implementations ──────────────────────────────────────────────

async function listGames(
  platform?: string,
  category?: string,
  sort_by?: string,
) {
  const params = new URLSearchParams();

  const resolvedPlatform = platform && platform !== 'all' ? platform : null;
  if (resolvedPlatform) params.set('platform', resolvedPlatform);
  if (category) params.set('category', category);
  if (sort_by) params.set('sort-by', sort_by);

  const url = `${BASE_URL}/games${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FreeToGame API error: ${res.status}`);

  const data = (await res.json()) as GameListItem[];

  return {
    total: data.length,
    games: data.map(formatGameListItem),
  };
}

async function getGame(id: number) {
  const res = await fetch(`${BASE_URL}/game?id=${id}`);
  if (res.status === 404) throw new Error(`Game not found for ID: ${id}`);
  if (!res.ok) throw new Error(`FreeToGame API error: ${res.status}`);

  const data = (await res.json()) as GameDetail;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    genre: data.genre,
    platform: data.platform,
    publisher: data.publisher,
    developer: data.developer,
    release_date: data.release_date,
    game_url: data.game_url,
    thumbnail: data.thumbnail,
    screenshots: (data.screenshots ?? []).map((s) => s.image),
    minimum_system_requirements: data.minimum_system_requirements
      ? {
          os: data.minimum_system_requirements.os ?? null,
          processor: data.minimum_system_requirements.processor ?? null,
          memory: data.minimum_system_requirements.memory ?? null,
          graphics: data.minimum_system_requirements.graphics ?? null,
          storage: data.minimum_system_requirements.storage ?? null,
        }
      : null,
  };
}

async function filterGames(tag: string, platform?: string) {
  const params = new URLSearchParams({ tag });
  if (platform) params.set('platform', platform);

  const res = await fetch(`${BASE_URL}/filter?${params}`);
  if (!res.ok) throw new Error(`FreeToGame API error: ${res.status}`);

  const data = (await res.json()) as GameListItem[] | { status: number; message: string };

  // API returns an object with status/message when no results are found
  if (!Array.isArray(data)) {
    return { total: 0, tag, games: [] };
  }

  return {
    total: data.length,
    tag,
    games: data.map(formatGameListItem),
  };
}

export default { tools, callTool } satisfies McpToolExport;
