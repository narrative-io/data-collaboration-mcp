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

// Dataset Statistics types
export interface DatasetStatistics {
  dataset_id: string;
  row_count: number;
  column_count: number;
  last_updated: string;
  data_size_bytes?: number;
  geographic_coverage?: string[];
  time_range?: { start: string; end: string };
  quality_score?: number;
}

export interface DatasetStatisticsResponse {
  statistics: DatasetStatistics;
}

// Dataset Sample types
export interface DatasetSampleRow {
  [column: string]: string | number | boolean | null;
}

export interface DatasetSample {
  dataset_id: string;
  records: DatasetSampleRow[];
  total_records?: number;
  sample_size: number;
  columns?: string[];
  sample_timestamp?: string;
}

export interface DatasetSampleResponse {
  records: DatasetSampleRow[];
}

// Access Rules types
export interface AccessRule {
  id: number;
  name?: string;
  company_id: number;
  company_name: string;
  company_slug?: string;
  display_name?: string;
  description?: string;
  image?: string;
  status?: 'active' | 'archived';
  tags?: string[];
  nql?: string;
  price_cpm_usd: number;
  type: 'owned' | 'implicit_share' | 'explicit_share';
  dataset_ids?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface AccessRulesResponse {
  records: AccessRule[];
  pagination?: {
    page: number;
    per_page: number;
    total_pages: number;
    total_records: number;
  };
}

// NQL Execution types
export interface NqlJob {
  id: string;
  query: string;
  status: 'submitted' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at?: string;
  sampleJobId?: string;
  statsJobId?: string;
  error?: string;
}

export interface NqlExecuteResponse {
  jobId: string;
  sampleJobId?: string;
  statsJobId?: string;
  status: 'submitted';
}

export interface NqlJobResults {
  jobId: string;
  status: string;
  resultType: 'sample' | 'statistics';
  data?: any;
  error?: string;
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

export const ListAccessRulesSchema = z.object({
  owned_only: z.boolean().optional(),
  shared_only: z.boolean().optional(),
  tag: z.union([z.string(), z.array(z.string())]).optional(),
  company_id: z.union([z.number(), z.array(z.number())]).optional(),
  dataset_id: z.union([z.number(), z.array(z.number())]).optional(),
  page: z.number().int().positive().default(1),
  per_page: z.number().int().positive().max(100).default(10),
});

export const SearchAccessRulesSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  owned_only: z.boolean().optional(),
  shared_only: z.boolean().optional(), 
  tag: z.union([z.string(), z.array(z.string())]).optional(),
  company_id: z.union([z.number(), z.array(z.number())]).optional(),
  dataset_id: z.union([z.number(), z.array(z.number())]).optional(),
  page: z.number().int().positive().default(1),
  per_page: z.number().int().positive().max(100).default(10),
});

export const DatasetStatisticsSchema = z.object({
  dataset_id: z.string().min(1, "Dataset ID cannot be empty"),
});

export const DatasetSampleSchema = z.object({
  dataset_id: z.string().min(1, "Dataset ID cannot be empty"),
  size: z.number().int().positive().max(100).default(10).optional(),
});

// NQL Command Execution Schemas
export const NqlExecuteSchema = z.object({
  query: z.string().trim().min(1, "NQL query cannot be empty"),
  generateSample: z.boolean().default(true).optional(),
  generateStats: z.boolean().default(true).optional(),
});

export const NqlGetResultsSchema = z.object({
  jobId: z.string().trim().min(1, "Job ID cannot be empty"),
  resultType: z.enum(["sample", "statistics"]),
});

// Type exports from schemas
export type EchoToolInput = z.infer<typeof EchoToolSchema>;
export type SearchAttributesInput = z.infer<typeof SearchAttributesSchema>;
export type ListDatasetsInput = z.infer<typeof ListDatasetsSchema>;
export type ListAccessRulesInput = z.infer<typeof ListAccessRulesSchema>;
export type SearchAccessRulesInput = z.infer<typeof SearchAccessRulesSchema>;
export type DatasetStatisticsInput = z.infer<typeof DatasetStatisticsSchema>;
export type DatasetSampleInput = z.infer<typeof DatasetSampleSchema>;
export type NqlExecuteInput = z.infer<typeof NqlExecuteSchema>;
export type NqlGetResultsInput = z.infer<typeof NqlGetResultsSchema>;

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

