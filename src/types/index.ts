import { z } from "zod";

// Import official MCP SDK types for resources
export type { 
  Resource,
  TextResourceContents,
} from "@modelcontextprotocol/sdk/types.js";

// Custom interface for our internal resource storage (maps to MCP Resource + content)
export interface StoredResource {
  id: string;
  name: string;
  content: string;
  description?: string;
  mimeType?: string;
}

export interface AttributeProperty {
  display_name: string;
  description: string;
  type: string;
}

export interface Attribute {
  id: number;
  description: string;
  display_name: string;
  name: string;
  type: string;
  properties?: Record<string, AttributeProperty>;
}

export interface AttributeResponse {
  prev_page: number | null;
  current_page: number;
  next_page: number | null;
  total_records: number;
  total_pages: number;
  records: Attribute[];
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  // Additional fields will be added based on actual API response
}

export interface DatasetResponse {
  records: Dataset[];
  // Additional pagination fields will be added if supported by API
}

// Zod schemas for tool input validation
export const EchoToolSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export const SearchAttributesSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(100).default(10),
});

export const ListDatasetsSchema = z.object({
  // No parameters required for listing datasets
});

// Type exports from schemas
export type EchoToolInput = z.infer<typeof EchoToolSchema>;
export type SearchAttributesInput = z.infer<typeof SearchAttributesSchema>;
export type ListDatasetsInput = z.infer<typeof ListDatasetsSchema>;

// Tool definition interface for better organization
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: object;
}

// Enhanced error types
export class ToolValidationError extends Error {
  constructor(
    public toolName: string,
    public validationErrors: z.ZodError,
    message?: string
  ) {
    super(message || `Validation failed for tool: ${toolName}`);
    this.name = "ToolValidationError";
  }
}

