# Narrative MCP Server

A Model Context Protocol (MCP) server that provides access to Narrative's Data Collaboration Platform APIs through any MCP server. For integrating your favorite data platform with your favorite LLM.

Learn more about Narrative: https://www.narrative.io/

## Setup

To use this MCP server, you need to configure it in your MCP settings file (`.cursor/mcp.json` for Cursor or `claude_desktop_config.json` for Claude Desktop).

Add the following configuration to your `mcp.json` file:

```json
{
    "mcpServers": {
        "narrative": {
            "command": "bun",
            "args": [
                "--cwd",
                "<FULL_PATH_TO>/data-collaboration-mcp",
                "dev"
            ],
            "env": {
                "NARRATIVE_API_URL": "https://api.narrative.io",
                "NARRATIVE_API_TOKEN": "<YOUR_API_TOKEN>"
            }
        }
    }
}
```

**Important:** 
- Replace `<YOUR_API_TOKEN>` with your actual Narrative API token (required)
- Update the path in the `--cwd` argument to point to your local installation of this repository
- Get your Narrative API token from your Narrative account settings at https://www.narrative.io/

After updating your MCP configuration, restart your editor or MCP client for the changes to take effect.

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

After configuring the MCP server and restarting your editor, verify it's working by:
- Asking your AI assistant to "List all available datasets"
- Asking it to "Search for attributes related to location"
- The Narrative tools should appear in the available MCP tools list

## Troubleshooting

Check MCP server logs if you encounter issues:

**For Cursor:**
```bash
# Check Cursor logs for MCP server errors
tail -f ~/Library/Logs/Cursor/logs/*.log
```

**For Claude Desktop:**
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```
