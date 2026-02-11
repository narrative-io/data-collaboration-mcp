# Narrative MCP Server

A Model Context Protocol (MCP) server that provides access to Narrative's Data Collaboration Platform APIs through any MCP server. For integrating your favorite data platform with your favorite LLM.

Learn more about Narrative: https://www.narrative.io/

## Setup

To use this MCP server, you need to configure it in your MCP settings file (eg `.cursor/mcp.json` for Cursor or `claude_desktop_config.json` for Claude Desktop).

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
- **`list_access_rules`**: List access rules with filtering options
- **`search_access_rules`**: Search access rules with query
- **`dataset_statistics`**: Get comprehensive statistics for a dataset
- **`dataset_sample`**: Retrieve sample records from a dataset
- **`nql_execute`**: Execute NQL queries asynchronously
- **`nql_get_results`**: Retrieve results from NQL query jobs
- **`echo`**: Simple echo tool for testing

## Available Prompts

This MCP server provides expert guidance prompts:

- **`execute-nql`**: Expert guidance for executing NQL queries on the Narrative platform. This prompt ensures queries follow all mandatory NQL syntax rules, namespace conventions, and best practices. It validates queries, enforces materialized view patterns, handles Rosetta Stone mappings, and provides post-execution guidance.

## Usage Examples

### Search for attributes
```
Search for attributes related to "demographics"
```

### List datasets
```
Show me all available datasets
```

### Use the NQL execution prompt
```
Use the execute-nql prompt to help me write a query that combines data from dataset 1234
```

The NQL execution prompt provides expert guidance including:
- Validation of NQL syntax and structure
- Enforcement of materialized view patterns
- Proper namespace and dataset reference handling
- Rosetta Stone integration guidance
- Post-execution result handling

## Development

### MCP Inspector

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is an interactive browser-based tool for testing and debugging MCP servers. It lets you connect to your server and manually invoke tools, browse resources, and test prompts — all without needing an LLM client.

#### Quick Start

```bash
npm run inspect
```

This loads the server config from `.mcp.json`, passes your `.env` credentials, and opens the Inspector UI in your browser. The terminal output will include a URL with an auth token — make sure to use that full URL:

```
http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=<token>
```

#### Manual Launch

You can also run the inspector directly with full control over options:

```bash
# Using your .mcp.json config (recommended)
source .env && npx @modelcontextprotocol/inspector \
  --config .mcp.json \
  --server data-collaboration \
  -e NARRATIVE_API_URL=$NARRATIVE_API_URL \
  -e NARRATIVE_API_TOKEN=$NARRATIVE_API_TOKEN

# Using an explicit command
source .env && npx @modelcontextprotocol/inspector \
  -e NARRATIVE_API_URL=$NARRATIVE_API_URL \
  -e NARRATIVE_API_TOKEN=$NARRATIVE_API_TOKEN \
  bun src/index.ts

# Against the compiled build
npm run build && source .env && npx @modelcontextprotocol/inspector \
  -e NARRATIVE_API_URL=$NARRATIVE_API_URL \
  -e NARRATIVE_API_TOKEN=$NARRATIVE_API_TOKEN \
  node build/index.js
```

#### Inspector CLI Flags

| Flag | Description |
|------|-------------|
| `--config <path>` | Path to an MCP config file (e.g. `.mcp.json`) |
| `--server <name>` | Server name from the config file to inspect |
| `-e KEY=VALUE` | Pass environment variables to the spawned server |
| `--transport <type>` | Transport type: `stdio`, `sse`, or `http` |
| `--cli` | Run in CLI mode (no browser UI) |

#### Using the Inspector UI

Once connected, the Inspector provides tabs for each MCP capability:

- **Tools** — List all tools, view their JSON schemas, execute them with custom inputs, and inspect the results
- **Resources** — Browse available resources, view metadata, and read resource contents
- **Prompts** — List prompt templates, fill in arguments, and preview the generated messages
- **Notifications** — View server log messages and notifications in real time

#### Development Workflow

1. Start the inspector: `npm run inspect`
2. Make changes to server code in `src/`
3. The inspector spawns the server fresh on each Connect — click **Disconnect** then **Connect** to pick up changes
4. Use the **History** panel to review the request/response sequence
5. Check **Server Notifications** for any logging messages from your server

#### Troubleshooting

- **Connect button does nothing**: Make sure the URL includes the `?MCP_PROXY_AUTH_TOKEN=...` query parameter. The inspector requires this token for authentication.
- **"Connection Error" after clicking Connect**: Check that your `.env` file contains valid `NARRATIVE_API_URL` and `NARRATIVE_API_TOKEN` values. The server will fail to start without them.
- **Wrong command/args shown**: Use `--config .mcp.json --server data-collaboration` to load from your config file rather than manually entering the command.

### Testing

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
