import { z } from "zod";
import type { 
  ToolDefinition, 
  EchoToolSchema, 
  SearchAttributesSchema, 
  ListDatasetsSchema,
  ListAccessRulesSchema,
  SearchAccessRulesSchema,
  DatasetStatisticsSchema,
  DatasetSampleSchema,
  NqlExecuteSchema,
  NqlGetResultsSchema,
  EchoToolInput,
  SearchAttributesInput,
  ListDatasetsInput,
  ListAccessRulesInput,
  SearchAccessRulesInput,
  DatasetStatisticsInput,
  DatasetSampleInput,
  NqlExecuteInput,
  NqlGetResultsInput
} from "../types/index.js";

/**
 * Registry of all available tools with their schemas and metadata.
 * This provides a centralized place to define tools with proper type safety.
 */
export class ToolRegistry {
  private static tools: Record<string, ToolDefinition> = {
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
    dataset_sample: {
      name: "dataset_sample",
      description: "Retrieve sample records from a dataset for data preview and schema understanding",
      inputSchema: {
        type: "object",
        properties: {
          dataset_id: {
            type: "string",
            description: "The ID of the dataset to get sample data from",
            minLength: 1,
          },
          size: {
            type: "number",
            description: "Number of sample records to retrieve (default: 10, max: 100)",
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },
        required: ["dataset_id"],
      },
    },
    nql_execute: {
      name: "nql_execute",
      description: "Execute an NQL (Narrative Query Language) query asynchronously. Returns job IDs for tracking execution. The query will run in the background and results can be retrieved using nql_get_results once the job completes.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The NQL query to execute (e.g., 'SELECT * FROM dataset_12345 LIMIT 10')",
            minLength: 1,
          },
          generateSample: {
            type: "boolean",
            description: "Whether to generate sample data from query results (default: true)",
            default: true,
          },
          generateStats: {
            type: "boolean",
            description: "Whether to generate statistics from query results (default: true)",
            default: true,
          },
        },
        required: ["query"],
      },
    },
    nql_get_results: {
      name: "nql_get_results",
      description: "Retrieve results from a completed NQL query job. Use this after executing an NQL query with nql_execute to get the sample data or statistics.",
      inputSchema: {
        type: "object",
        properties: {
          jobId: {
            type: "string",
            description: "The job ID returned from nql_execute",
            minLength: 1,
          },
          resultType: {
            type: "string",
            description: "Type of results to retrieve",
            enum: ["sample", "statistics"],
          },
        },
        required: ["jobId", "resultType"],
      },
    },
  };

  /**
   * Get all tool definitions for the tools/list endpoint
   */
  static getAllTools(): ToolDefinition[] {
    return Object.values(this.tools);
  }

  /**
   * Get a specific tool definition by name
   */
  static getTool(name: string): ToolDefinition | undefined {
    return this.tools[name];
  }

  /**
   * Validate input for echo tool using Zod schema
   */
  static validateEchoInput(input: unknown): EchoToolInput {
    const EchoSchema = z.object({
      message: z.string().min(1, "Message cannot be empty"),
    });
    return EchoSchema.parse(input);
  }

  /**
   * Validate input for search_attributes tool using Zod schema
   */
  static validateSearchAttributesInput(input: unknown): SearchAttributesInput {
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
  static validateListDatasetsInput(input: unknown): ListDatasetsInput {
    const ListSchema = z.object({});
    return ListSchema.parse(input);
  }

  /**
   * Validate input for list_access_rules tool using Zod schema
   */
  static validateListAccessRulesInput(input: unknown): ListAccessRulesInput {
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
  static validateSearchAccessRulesInput(input: unknown): SearchAccessRulesInput {
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
  static validateDatasetStatisticsInput(input: unknown): DatasetStatisticsInput {
    const DatasetStatisticsSchema = z.object({
      dataset_id: z.string().min(1, "Dataset ID cannot be empty"),
    });
    return DatasetStatisticsSchema.parse(input);
  }

  /**
   * Validate input for dataset_sample tool using Zod schema
   */
  static validateDatasetSampleInput(input: unknown): DatasetSampleInput {
    const DatasetSampleSchema = z.object({
      dataset_id: z.string().min(1, "Dataset ID cannot be empty"),
      size: z.number().int().positive().max(100).default(10).optional(),
    });
    return DatasetSampleSchema.parse(input);
  }

  /**
   * Validate input for nql_execute tool using Zod schema
   */
  static validateNqlExecuteInput(input: unknown): NqlExecuteInput {
    const NqlExecuteSchema = z.object({
      query: z.string().trim().min(1, "NQL query cannot be empty"),
      generateSample: z.boolean().default(true).optional(),
      generateStats: z.boolean().default(true).optional(),
    });
    return NqlExecuteSchema.parse(input);
  }

  /**
   * Validate input for nql_get_results tool using Zod schema
   */
  static validateNqlGetResultsInput(input: unknown): NqlGetResultsInput {
    const NqlGetResultsSchema = z.object({
      jobId: z.string().trim().min(1, "Job ID cannot be empty"),
      resultType: z.enum(["sample", "statistics"]),
    });
    return NqlGetResultsSchema.parse(input);
  }

  /**
   * Generic validation method that routes to the appropriate validator
   */
  static validateToolInput(toolName: string, input: unknown): unknown {
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
      case "dataset_sample":
        return this.validateDatasetSampleInput(input);
      case "nql_execute":
        return this.validateNqlExecuteInput(input);
      case "nql_get_results":
        return this.validateNqlGetResultsInput(input);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}