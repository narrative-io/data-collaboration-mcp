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

The server supports flexible environment variable configuration with the following precedence (highest to lowest):

1. **MCP config `env` field** - Set in Claude Desktop or MCP configuration
2. **System environment variables** - Set via shell/OS environment
3. **`.env` file** - Local development file (gitignored)

#### For Local Development

```bash
cp .env.example .env
```

Then edit `.env` and add your Narrative API credentials:

```
NARRATIVE_API_TOKEN=your_api_token_here
NARRATIVE_API_URL=https://api.narrative.io
```

#### For Production / Claude Desktop

Set environment variables in your MCP configuration file (see Installation section below). This takes precedence over the `.env` file.

#### Debug Configuration Sources

To see which configuration source is being used, set the debug flag:

```bash
DEBUG=1 bun src/index.ts
# or
MCP_DEBUG=1 bun src/index.ts
```

This will log which configuration source provided each variable.

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

1. First, ensure you have the build ready:

```bash
bun run build
```

2. Add this to your Claude Desktop configuration file:

```bash
# On macOS
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

3. Add this JSON (replace with YOUR actual paths and credentials):

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

**Important Security Note**: Environment variables in the MCP config file take precedence over `.env` files. For production environments, use system environment variables or MCP config. Never commit sensitive credentials to version control.

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
