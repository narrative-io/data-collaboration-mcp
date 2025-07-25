# Narrative MCP Server

A Model Context Protocol (MCP) server that provides access to Narrative's Data Collaboration Platform APIs through any MCP server. For integrating your favorite data platform with your favorite LLM.

Learn more about Narrative: https://www.narrative.io/

## Setup

1. Install dependencies:

```bash
bun install @modelcontextprotocol/sdk dotenv
bun add -D typescript @types/node
bun add axios
```

2. Configure environment variables:

For development/testing:
```bash
cp .env.template .env
```

Edit `.env` and add your Narrative API credentials:
- `NARRATIVE_API_TOKEN` - Your Narrative API token
- `NARRATIVE_API_URL` - Base URL for Narrative API endpoints (default: https://api.narrative.io)

**Note**: When using with Claude Desktop, environment variables must be passed through the MCP configuration (see Installation section below).

3. Create your server code in `src/index.ts`

4. Run your server:

```bash
bun src/index.ts
```

## Installation

### For Claude Code Users 

The easiest way to install this MCP server is using Claude Code:

```bash
claude mcp install https://github.com/narrative-io/nio_mcp.git
```

This will automatically:
- Clone the repository 
- Install dependencies
- Set up the MCP server configuration
- Make it available in your Claude Code sessions

### Manual Installation for Claude Desktop

If you prefer to configure manually for Claude Desktop:

1. Add this to your Claude Desktop configuration file:

```bash
# On macOS
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Add this JSON (replace with YOUR actual paths):

```json
{
  "mcpServers": {
    "narrative-mcp": {
      "command": "/full/path/to/bun",
      "args": ["/full/path/to/your/project/build/index.js"],
      "env": {
        "NARRATIVE_API_URL": "https://api.narrative.io",
        "NARRATIVE_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

Find your bun path with:
```bash
which bun
```

## Available Tools

This MCP server provides the following tools:

- **`search_attributes`**: Search Narrative Rosetta Stone attributes with pagination
- **`list_datasets`**: List all available datasets from the Narrative marketplace
- **`echo`**: Simple echo tool for testing

## Usage Examples

### Search for attributes
```
Search for attributes related to "demographics"
```

### List datasets
```
Show me all available datasets
```

## Testing

Run the test suite:
```bash
bun run test
```

## Verification

### For Claude Code
After installation, you can verify the server is working by asking Claude to:
- "List all available datasets"
- "Search for attributes related to location"

### For Claude Desktop
1. Restart Claude Desktop
2. Click the "+" button in Claude's input box
3. Your server's tools should appear in the list

## Troubleshooting

### Claude Code
Check MCP server status:
```bash
claude mcp list
```

### Claude Desktop
Check logs:
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```
