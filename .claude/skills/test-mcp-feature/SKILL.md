---
name: test-mcp-feature
description: Test an MCP server feature (tool, resource, or prompt) using the MCP Inspector CLI mode. Validates response shapes, data correctness, and error handling.
argument-hint: "[feature-name]"
---

# Test MCP Server Feature

**Feature to test:** `$ARGUMENTS`

## Instructions

Use the MCP Inspector CLI mode to verify that an MCP server feature (tool, resource, or prompt) works correctly. This is a headless testing workflow — no browser UI needed.

The inspector spawns the server, calls the specified method, prints JSON to stdout, and exits. Use this to validate response shapes, data correctness, and error handling during development.

## Step 1: Identify What to Test

Determine what type of MCP feature you're testing:

| Feature Type | List Method | Invoke Method |
|-------------|-------------|---------------|
| Tool | `tools/list` | `tools/call` |
| Resource | `resources/list` | `resources/read` |
| Prompt | `prompts/list` | `prompts/get` |

## Step 2: Verify the Feature Is Registered

First confirm the feature shows up in the server's capability listing:

```bash
npm run inspect -- --cli --method tools/list
npm run inspect -- --cli --method resources/list
npm run inspect -- --cli --method prompts/list
```

Check that the feature name, description, and input schema match what you expect. If the feature doesn't appear, verify it's registered in `src/lib/tool-registry.ts` and handled in `src/handlers/tool-handlers.ts`.

## Step 3: Call the Feature and Inspect Results

### For tools:

```bash
# No arguments
npm run inspect -- --cli --method tools/call --tool-name list_datasets

# With arguments
npm run inspect -- --cli --method tools/call --tool-name search_attributes --tool-arg 'query=email'

# Multiple arguments
npm run inspect -- --cli --method tools/call --tool-name dataset_sample --tool-arg 'dataset_id=123' --tool-arg 'size=5'
```

### For resources:

```bash
npm run inspect -- --cli --method resources/read --resource-uri 'resource:///1'
```

### For prompts:

```bash
npm run inspect -- --cli --method prompts/get --prompt-name execute-nql --prompt-arg 'query=SELECT * FROM dataset_123'
```

## Step 4: Validate the Response

Inspect the JSON output and verify:

1. **Response structure** — The response follows MCP protocol format (e.g. `{ content: [{ type: "text", text: "..." }] }` for tools)
2. **Data correctness** — The returned data matches what you'd expect from the underlying API
3. **Error handling** — Test with invalid inputs to confirm errors are returned properly, not thrown

### Parsing nested JSON

Tool responses often contain stringified JSON inside the `text` field. Use `jq` to extract and pretty-print it:

```bash
npm run inspect -- --cli --method tools/call --tool-name list_datasets 2>/dev/null | jq '.content[0].text | fromjson'
```

## Step 5: Test Edge Cases

Run these scenarios to verify robustness:

```bash
# Missing required arguments (should return an MCP error, not crash)
npm run inspect -- --cli --method tools/call --tool-name search_attributes

# Invalid argument values
npm run inspect -- --cli --method tools/call --tool-name dataset_statistics --tool-arg 'dataset_id='

# Empty results (search for something that won't match)
npm run inspect -- --cli --method tools/call --tool-name search_attributes --tool-arg 'query=zzzznonexistent'
```

## Example: Testing `list_datasets`

Here's a complete example of testing the `list_datasets` tool end-to-end:

```bash
# 1. Verify the tool is registered with correct schema
npm run inspect -- --cli --method tools/list 2>/dev/null | jq '.tools[] | select(.name == "list_datasets")'

# Expected: tool definition with name, description, and inputSchema

# 2. Call the tool
npm run inspect -- --cli --method tools/call --tool-name list_datasets

# Expected: { content: [{ type: "text", text: "<JSON string of datasets>" }] }

# 3. Parse and inspect the actual data
npm run inspect -- --cli --method tools/call --tool-name list_datasets 2>/dev/null | jq '.content[0].text | fromjson'

# Expected: array of dataset objects with id, name, description, etc.

# 4. Verify the response isn't an error
npm run inspect -- --cli --method tools/call --tool-name list_datasets 2>/dev/null | jq '.isError // false'

# Expected: false
```

## Adding Server Logging for Debugging

If you need to trace what's happening inside a handler, add logging messages that will appear in stderr:

```typescript
// In your tool handler
console.error(`[DEBUG] Fetching datasets, got ${results.length} results`);

// Or use MCP logging (visible in Inspector UI notifications panel)
await this.server.sendLoggingMessage({
  level: "info",
  data: { step: "fetching datasets", count: results.length },
  logger: "tool-handler",
});
```

When using CLI mode, `console.error` output appears in the terminal alongside the JSON output. Use `2>/dev/null` to suppress it when piping through `jq`.

## Quick Reference

```bash
# List all tools
npm run inspect -- --cli --method tools/list

# Call a tool (no args)
npm run inspect -- --cli --method tools/call --tool-name <name>

# Call a tool (with args)
npm run inspect -- --cli --method tools/call --tool-name <name> --tool-arg 'key=value'

# Parse tool response
npm run inspect -- --cli --method tools/call --tool-name <name> 2>/dev/null | jq '.content[0].text | fromjson'

# List resources
npm run inspect -- --cli --method resources/list

# Read a resource
npm run inspect -- --cli --method resources/read --resource-uri '<uri>'

# List prompts
npm run inspect -- --cli --method prompts/list

# Get a prompt
npm run inspect -- --cli --method prompts/get --prompt-name <name> --prompt-arg 'key=value'
```
