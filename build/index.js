// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config, validateEnvironmentVariables } from "./lib/config.js";
import { NarrativeApiClient } from "./lib/api-client.js";
import { ToolHandlers } from "./handlers/tool-handlers.js";
import { ResourceHandlers } from "./handlers/resource-handlers.js";
import { PromptHandlers } from "./handlers/prompt-handlers.js";
// Export for testing
export { validateEnvironmentVariables };
// Sample resources (replace with your own)
const resources = {
    "1": {
        id: "1",
        name: "Sample Resource",
        content: "This is a sample resource that Claude can access.",
        description: "A sample resource for testing",
        mimeType: "text/plain",
    },
};
class MyMcpServer {
    server;
    apiClient;
    toolHandlers;
    resourceHandlers;
    promptHandlers;
    constructor() {
        try {
            this.apiClient = new NarrativeApiClient(config.apiUrl, config.apiToken);
        }
        catch (error) {
            console.error("Failed to initialize MCP server:", error);
            throw error;
        }
        this.server = new Server({
            name: "narrative-mcp-server",
            version: "0.1.0",
        }, {
            capabilities: {
                resources: {
                    // Support for dynamic resource reading and ResourceTemplate
                    subscribe: true,
                    listChanged: true,
                },
                tools: {
                    // Support for tool execution
                    listChanged: true,
                },
                prompts: {
                    // Support for prompts
                    listChanged: true,
                },
                logging: {
                // Support for logging messages
                },
            },
            instructions: "Narrative MCP Server provides access to Narrative's data marketplace APIs. Available tools: echo (test), search_attributes (search Rosetta Stone), list_datasets (list available datasets), list_access_rules (list access rules with filtering), search_access_rules (search access rules), dataset_statistics (get dataset statistics), dataset_sample (get dataset samples), nql_execute (execute NQL queries asynchronously), nql_get_results (retrieve NQL query results). Prompts: execute-nql (expert guidance for NQL query execution). Resources are created dynamically when tools are used.",
        });
        this.toolHandlers = new ToolHandlers(this.server, this.apiClient, resources);
        this.resourceHandlers = new ResourceHandlers(this.server, () => this.toolHandlers.getResourceManager(), this.apiClient);
        this.promptHandlers = new PromptHandlers(this.server);
        this.setupHandlers();
        this.setupErrorHandling();
    }
    setupHandlers() {
        this.resourceHandlers.setup();
        this.toolHandlers.setup();
        this.promptHandlers.setup();
    }
    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error("[MCP Server] Error:", error);
            // Send logging message to client if possible
            if (this.server.getClientCapabilities()?.logging) {
                this.server.sendLoggingMessage({
                    level: "error",
                    data: error,
                    logger: "narrative-mcp-server",
                }).catch((loggingError) => {
                    console.error("[MCP Server] Failed to send logging message:", loggingError);
                });
            }
        };
        process.on("SIGINT", async () => {
            console.log("[MCP Server] Shutting down gracefully...");
            try {
                await this.server.close();
                console.log("[MCP Server] Server closed successfully");
            }
            catch (error) {
                console.error("[MCP Server] Error during shutdown:", error);
            }
            process.exit(0);
        });
        process.on("uncaughtException", (error) => {
            console.error("[MCP Server] Uncaught exception:", error);
            process.exit(1);
        });
        process.on("unhandledRejection", (reason, promise) => {
            console.error("[MCP Server] Unhandled rejection at:", promise, "reason:", reason);
            process.exit(1);
        });
    }
    async run() {
        try {
            const transport = new StdioServerTransport();
            await this.server.connect(transport);
            // Set up initialization callback
            this.server.oninitialized = () => {
                const clientInfo = this.server.getClientVersion();
                const clientCaps = this.server.getClientCapabilities();
                console.error(`[MCP Server] Connected to client: ${clientInfo?.name || 'unknown'} v${clientInfo?.version || 'unknown'}`);
                console.error(`[MCP Server] Client capabilities: ${JSON.stringify(clientCaps)}`);
                // Send welcome logging message if client supports it
                if (clientCaps?.logging) {
                    this.server.sendLoggingMessage({
                        level: "info",
                        data: "Narrative MCP Server initialized successfully",
                        logger: "narrative-mcp-server",
                    }).catch(console.error);
                }
            };
        }
        catch (error) {
            console.error("[MCP Server] Failed to start server:", error);
            throw error;
        }
    }
}
// Server startup with enhanced error handling
async function startServer() {
    try {
        // Validate environment before starting
        validateEnvironmentVariables();
        console.error("[MCP Server] Starting Narrative MCP Server...");
        const server = new MyMcpServer();
        await server.run();
    }
    catch (error) {
        console.error("[MCP Server] Fatal error during startup:", error);
        process.exit(1);
    }
}
// Start server (this file is the main entry point)
startServer();
