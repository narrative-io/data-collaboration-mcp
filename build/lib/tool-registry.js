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
        list_access_rules: {
            name: "list_access_rules",
            description: "List access rules with optional filtering by ownership, tags, company, or dataset",
            inputSchema: {
                type: "object",
                properties: {
                    owned_only: {
                        type: "boolean",
                        description: "Filter for owned access rules only",
                    },
                    shared_only: {
                        type: "boolean",
                        description: "Filter for shared access rules only",
                    },
                    tag: {
                        anyOf: [
                            { type: "string" },
                            { type: "array", items: { type: "string" } }
                        ],
                        description: "Filter by tag(s)",
                    },
                    company_id: {
                        anyOf: [
                            { type: "number" },
                            { type: "array", items: { type: "number" } }
                        ],
                        description: "Filter by company ID(s)",
                    },
                    dataset_id: {
                        anyOf: [
                            { type: "number" },
                            { type: "array", items: { type: "number" } }
                        ],
                        description: "Filter by dataset ID(s)",
                    },
                    page: {
                        type: "number",
                        description: "Page number (starts at 1)",
                        minimum: 1,
                        default: 1,
                    },
                    per_page: {
                        type: "number",
                        description: "Results per page (default: 10)",
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                    },
                },
                required: [],
            },
        },
        search_access_rules: {
            name: "search_access_rules",
            description: "Search access rules with query string and optional filtering",
            inputSchema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search term for access rules",
                        minLength: 1,
                    },
                    owned_only: {
                        type: "boolean",
                        description: "Filter for owned access rules only",
                    },
                    shared_only: {
                        type: "boolean",
                        description: "Filter for shared access rules only",
                    },
                    tag: {
                        anyOf: [
                            { type: "string" },
                            { type: "array", items: { type: "string" } }
                        ],
                        description: "Filter by tag(s)",
                    },
                    company_id: {
                        anyOf: [
                            { type: "number" },
                            { type: "array", items: { type: "number" } }
                        ],
                        description: "Filter by company ID(s)",
                    },
                    dataset_id: {
                        anyOf: [
                            { type: "number" },
                            { type: "array", items: { type: "number" } }
                        ],
                        description: "Filter by dataset ID(s)",
                    },
                    page: {
                        type: "number",
                        description: "Page number (starts at 1)",
                        minimum: 1,
                        default: 1,
                    },
                    per_page: {
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
        dataset_statistics: {
            name: "dataset_statistics",
            description: "Get comprehensive statistics for a specific dataset including row count, column count, and data quality metrics",
            inputSchema: {
                type: "object",
                properties: {
                    dataset_id: {
                        type: "string",
                        description: "The ID of the dataset to get statistics for",
                        minLength: 1,
                    },
                },
                required: ["dataset_id"],
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
     * Validate input for list_access_rules tool using Zod schema
     */
    static validateListAccessRulesInput(input) {
        const ListAccessRulesSchema = z.object({
            owned_only: z.boolean().optional(),
            shared_only: z.boolean().optional(),
            tag: z.union([z.string(), z.array(z.string())]).optional(),
            company_id: z.union([z.number(), z.array(z.number())]).optional(),
            dataset_id: z.union([z.number(), z.array(z.number())]).optional(),
            page: z.number().int().positive().default(1),
            per_page: z.number().int().positive().max(100).default(10),
        });
        return ListAccessRulesSchema.parse(input);
    }
    /**
     * Validate input for search_access_rules tool using Zod schema
     */
    static validateSearchAccessRulesInput(input) {
        const SearchAccessRulesSchema = z.object({
            query: z.string().min(1, "Query cannot be empty"),
            owned_only: z.boolean().optional(),
            shared_only: z.boolean().optional(),
            tag: z.union([z.string(), z.array(z.string())]).optional(),
            company_id: z.union([z.number(), z.array(z.number())]).optional(),
            dataset_id: z.union([z.number(), z.array(z.number())]).optional(),
            page: z.number().int().positive().default(1),
            per_page: z.number().int().positive().max(100).default(10),
        });
        return SearchAccessRulesSchema.parse(input);
    }
    /**
     * Validate input for dataset_statistics tool using Zod schema
     */
    static validateDatasetStatisticsInput(input) {
        const DatasetStatisticsSchema = z.object({
            dataset_id: z.string().min(1, "Dataset ID cannot be empty"),
        });
        return DatasetStatisticsSchema.parse(input);
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
            case "list_access_rules":
                return this.validateListAccessRulesInput(input);
            case "search_access_rules":
                return this.validateSearchAccessRulesInput(input);
            case "dataset_statistics":
                return this.validateDatasetStatisticsInput(input);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
}
