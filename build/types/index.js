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
