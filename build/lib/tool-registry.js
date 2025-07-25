import { z } from "zod";
/**
 * Registry of all available tools with their schemas and metadata.
 * This provides a centralized place to define tools with proper type safety.
 */
export class ToolRegistry {
    static tools = {
        echo: {
            name: "echo",
            description: "Echo back a message",
            inputSchema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Message to echo back",
                        minLength: 1,
                    },
                },
                required: ["message"],
            },
        },
        search_attributes: {
            name: "search_attributes",
            description: "Search Narrative Rosetta Stone Attributes",
            inputSchema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search term for attributes",
                        minLength: 1,
                    },
                    page: {
                        type: "number",
                        description: "Page number (starts at 1)",
                        minimum: 1,
                        default: 1,
                    },
                    perPage: {
                        type: "number",
                        description: "Results per page (default: 10)",
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                    },
                },
                required: ["query"],
            },
        },
        list_datasets: {
            name: "list_datasets",
            description: "List all available datasets in this user's account",
            inputSchema: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    };
    /**
     * Get all tool definitions for the tools/list endpoint
     */
    static getAllTools() {
        return Object.values(this.tools);
    }
    /**
     * Get a specific tool definition by name
     */
    static getTool(name) {
        return this.tools[name];
    }
    /**
     * Validate input for echo tool using Zod schema
     */
    static validateEchoInput(input) {
        const EchoSchema = z.object({
            message: z.string().min(1, "Message cannot be empty"),
        });
        return EchoSchema.parse(input);
    }
    /**
     * Validate input for search_attributes tool using Zod schema
     */
    static validateSearchAttributesInput(input) {
        const SearchSchema = z.object({
            query: z.string().min(1, "Query cannot be empty"),
            page: z.number().int().positive().default(1),
            perPage: z.number().int().positive().max(100).default(10),
        });
        return SearchSchema.parse(input);
    }
    /**
     * Validate input for list_datasets tool using Zod schema
     */
    static validateListDatasetsInput(input) {
        const ListSchema = z.object({});
        return ListSchema.parse(input);
    }
    /**
     * Generic validation method that routes to the appropriate validator
     */
    static validateToolInput(toolName, input) {
        switch (toolName) {
            case "echo":
                return this.validateEchoInput(input);
            case "search_attributes":
                return this.validateSearchAttributesInput(input);
            case "list_datasets":
                return this.validateListDatasetsInput(input);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
}
