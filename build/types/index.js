import { z } from "zod";
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
// Enhanced error types
export class ToolValidationError extends Error {
    toolName;
    validationErrors;
    constructor(toolName, validationErrors, message) {
        super(message || `Validation failed for tool: ${toolName}`);
        this.toolName = toolName;
        this.validationErrors = validationErrors;
        this.name = "ToolValidationError";
    }
}
