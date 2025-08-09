import { ListToolsRequestSchema, CallToolRequestSchema, ErrorCode, McpError, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ToolRegistry } from "../lib/tool-registry.js";
import { ResourceManager } from "../lib/resource-manager.js";
export class ToolHandlers {
    server;
    apiClient;
    resourceManager;
    constructor(server, apiClient, resources) {
        this.server = server;
        this.apiClient = apiClient;
        this.resourceManager = new ResourceManager(resources);
    }
    setup() {
        this.setupToolsList();
        this.setupToolCalls();
    }
    /**
     * Get the underlying resources for use by ResourceHandlers
     */
    getResources() {
        return this.resourceManager.getAllResources();
    }
    /**
     * Get the resource manager for direct access to SDK-compatible methods
     */
    getResourceManager() {
        return this.resourceManager;
    }
    setupToolsList() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: ToolRegistry.getAllTools(),
        }));
    }
    setupToolCalls() {
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                // Validate input using ToolRegistry
                const validatedInput = ToolRegistry.validateToolInput(request.params.name, request.params.arguments || {});
                switch (request.params.name) {
                    case "echo":
                        return this.handleEcho(validatedInput);
                    case "search_attributes":
                        return this.handleSearchAttributes(validatedInput);
                    case "list_datasets":
                        return this.handleListDatasets(validatedInput);
                    case "list_access_rules":
                        return this.handleListAccessRules(validatedInput);
                    case "search_access_rules":
                        return this.handleSearchAccessRules(validatedInput);
                    case "dataset_statistics":
                        return this.handleDatasetStatistics(validatedInput);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
            }
            catch (error) {
                if (error instanceof z.ZodError) {
                    throw new McpError(ErrorCode.InvalidParams, `Invalid parameters for tool ${request.params.name}: ${error.message}`);
                }
                throw error;
            }
        });
    }
    async handleEcho(args) {
        // Input is already validated by ToolRegistry, so we can use it directly
        return {
            content: [
                {
                    type: "text",
                    text: `Echo: ${args.message}`,
                },
            ],
        };
    }
    async handleSearchAttributes(args) {
        // Input is already validated and has defaults applied by ToolRegistry
        try {
            const response = await this.apiClient.fetchAttributes(args.query, args.page, args.perPage);
            // Store attributes in memory for resource access using ResourceManager
            this.resourceManager.addAttributesAsResources(response.records);
            // Format the response
            const formattedResults = response.records.map(attr => {
                // Include full description, with smart truncation only for extremely long descriptions
                const description = attr.description.length > 500
                    ? `${attr.description.substring(0, 497)}...`
                    : attr.description;
                return `- **${attr.display_name}** (ID: ${attr.id}, Name: ${attr.name})
  Type: ${attr.type}
  Description: ${description}`;
            }).join('\n\n');
            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${response.total_records} attributes matching "${args.query}"\nPage ${response.current_page} of ${response.total_pages}\n\n${formattedResults}\n\nYou can access full attribute details as resources.`
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error searching attributes: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    }
    async handleListDatasets(_args) {
        try {
            const response = await this.apiClient.fetchDatasets();
            // Store datasets in memory for backward compatibility with legacy resource access
            this.resourceManager.addDatasetsAsResources(response.records);
            // Format the response with ResourceTemplate links
            const formattedResults = response.records.map(dataset => {
                const description = dataset.description ? dataset.description.substring(0, 100) : 'No description available';
                return `- ${dataset.name} (ID: ${dataset.id}): ${description}...\n  Resource: dataset://${dataset.id}`;
            }).join('\n');
            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${response.records.length} datasets\n\n${formattedResults}\n\nAccess full dataset details using the resource links above (e.g., dataset://12345).`
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching datasets: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    }
    async handleListAccessRules(args) {
        try {
            const response = await this.apiClient.fetchAccessRules(args);
            // Store access rules in memory for resource access
            this.resourceManager.addAccessRulesAsResources(response.records);
            // Format the response with resource links
            const formattedResults = response.records.map(rule => {
                const name = rule.display_name || rule.name || `Access Rule ${rule.id}`;
                const description = rule.description ? rule.description.substring(0, 100) : 'No description available';
                const tagsText = rule.tags && rule.tags.length > 0 ? ` [${rule.tags.join(', ')}]` : '';
                const typeText = rule.type ? ` (${rule.type})` : '';
                return `- ${name} (ID: ${rule.id})${typeText}: ${description}...${tagsText}\n  Resource: access-rule://${rule.id}`;
            }).join('\n');
            const paginationText = response.pagination
                ? `\nPage ${response.pagination.page} of ${response.pagination.total_pages} (${response.pagination.total_records} total)`
                : '';
            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${response.records.length} access rules${paginationText}\n\n${formattedResults}\n\nAccess full access rule details using the resource links above (e.g., access-rule://12345).`
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching access rules: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    }
    async handleSearchAccessRules(args) {
        try {
            const response = await this.apiClient.searchAccessRules(args);
            // Store access rules in memory for resource access
            this.resourceManager.addAccessRulesAsResources(response.records);
            // Format the response with resource links
            const formattedResults = response.records.map(rule => {
                const name = rule.display_name || rule.name || `Access Rule ${rule.id}`;
                const description = rule.description ? rule.description.substring(0, 100) : 'No description available';
                const tagsText = rule.tags && rule.tags.length > 0 ? ` [${rule.tags.join(', ')}]` : '';
                const typeText = rule.type ? ` (${rule.type})` : '';
                return `- ${name} (ID: ${rule.id})${typeText}: ${description}...${tagsText}\n  Resource: access-rule://${rule.id}`;
            }).join('\n');
            const paginationText = response.pagination
                ? `\nPage ${response.pagination.page} of ${response.pagination.total_pages} (${response.pagination.total_records} total)`
                : '';
            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${response.records.length} access rules matching "${args.query}"${paginationText}\n\n${formattedResults}\n\nAccess full access rule details using the resource links above (e.g., access-rule://12345).`
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error searching access rules: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    }
    async handleDatasetStatistics(args) {
        try {
            const response = await this.apiClient.fetchDatasetStatistics(args.dataset_id);
            // Store statistics as MCP resource for detailed access
            const resourceId = `dataset-statistics-${args.dataset_id}`;
            this.resourceManager.setResource(resourceId, {
                id: resourceId,
                name: `Statistics for Dataset ${args.dataset_id}`,
                content: JSON.stringify(response.statistics, null, 2),
                description: `Comprehensive statistics for dataset ${args.dataset_id}`,
                mimeType: "application/json"
            });
            // Format the statistics display
            const stats = response.statistics;
            const formattedStats = [
                `**Dataset Statistics for ${stats.dataset_id}**`,
                ``,
                `📊 **Core Metrics:**`,
                `- Row Count: ${stats.row_count.toLocaleString()}`,
                `- Column Count: ${stats.column_count}`,
                `- Last Updated: ${new Date(stats.last_updated).toLocaleDateString()}`,
            ];
            // Add optional statistics if available
            if (stats.data_size_bytes) {
                const sizeInMB = (stats.data_size_bytes / 1024 / 1024).toFixed(2);
                formattedStats.push(`- Data Size: ${sizeInMB} MB`);
            }
            if (stats.quality_score !== undefined) {
                formattedStats.push(`- Quality Score: ${stats.quality_score}/100`);
            }
            if (stats.geographic_coverage && stats.geographic_coverage.length > 0) {
                formattedStats.push(``, `🌍 **Geographic Coverage:** ${stats.geographic_coverage.join(', ')}`);
            }
            if (stats.time_range) {
                formattedStats.push(``, `📅 **Time Range:** ${stats.time_range.start} to ${stats.time_range.end}`);
            }
            formattedStats.push(``, `Resource: dataset-statistics://${args.dataset_id}`);
            return {
                content: [
                    {
                        type: "text",
                        text: formattedStats.join('\n')
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching dataset statistics for ${args.dataset_id}: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    }
}
