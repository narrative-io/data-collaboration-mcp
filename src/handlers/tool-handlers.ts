import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { 
  StoredResource, 
  ToolValidationError,
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
import { NarrativeApiClient } from "../lib/api-client.js";
import { ToolRegistry } from "../lib/tool-registry.js";
import { ResourceManager } from "../lib/resource-manager.js";

export class ToolHandlers {
  private resourceManager: ResourceManager;

  constructor(
    private server: Server,
    private apiClient: NarrativeApiClient,
    resources: Record<string, StoredResource>
  ) {
    this.resourceManager = new ResourceManager(resources);
  }

  setup(): void {
    this.setupToolsList();
    this.setupToolCalls();
  }

  /**
   * Get the underlying resources for use by ResourceHandlers
   */
  getResources(): Record<string, StoredResource> {
    return this.resourceManager.getAllResources();
  }

  /**
   * Get the resource manager for direct access to SDK-compatible methods
   */
  getResourceManager(): ResourceManager {
    return this.resourceManager;
  }

  private setupToolsList(): void {
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      async () => ({
        tools: ToolRegistry.getAllTools(),
      })
    );
  }

  private setupToolCalls(): void {
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        try {
          // Validate input using ToolRegistry
          const validatedInput = ToolRegistry.validateToolInput(
            request.params.name,
            request.params.arguments || {}
          );

          switch (request.params.name) {
            case "echo":
              return this.handleEcho(validatedInput as EchoToolInput);
            case "search_attributes":
              return this.handleSearchAttributes(validatedInput as SearchAttributesInput);
            case "list_datasets":
              return this.handleListDatasets(validatedInput as ListDatasetsInput);
            case "list_access_rules":
              return this.handleListAccessRules(validatedInput as ListAccessRulesInput);
            case "search_access_rules":
              return this.handleSearchAccessRules(validatedInput as SearchAccessRulesInput);
            case "dataset_statistics":
              return this.handleDatasetStatistics(validatedInput as DatasetStatisticsInput);
            case "dataset_sample":
              return this.handleDatasetSample(validatedInput as DatasetSampleInput);
            case "nql_execute":
              return this.handleNqlExecute(validatedInput as NqlExecuteInput);
            case "nql_get_results":
              return this.handleNqlGetResults(validatedInput as NqlGetResultsInput);
            default:
              throw new McpError(
                ErrorCode.MethodNotFound,
                `Unknown tool: ${request.params.name}`
              );
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new McpError(
              ErrorCode.InvalidParams,
              `Invalid parameters for tool ${request.params.name}: ${error.message}`
            );
          }
          throw error;
        }
      }
    );
  }

  private async handleEcho(args: EchoToolInput) {
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

  private async handleSearchAttributes(args: SearchAttributesInput) {
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
    } catch (error) {
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

  private async handleListDatasets(_args: ListDatasetsInput) {
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
    } catch (error) {
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

  private async handleListAccessRules(args: ListAccessRulesInput) {
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
    } catch (error) {
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

  private async handleSearchAccessRules(args: SearchAccessRulesInput) {
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
    } catch (error) {
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

  private async handleDatasetStatistics(args: DatasetStatisticsInput) {
    try {
      const response = await this.apiClient.fetchDatasetStatistics(args.dataset_id);
      
      // Store statistics as MCP resource for detailed access
      const resourceId = `dataset-statistics-${args.dataset_id}`;
      this.resourceManager.setResource(resourceId, {
        id: resourceId,
        name: `Statistics for Dataset ${args.dataset_id}`,
        content: JSON.stringify(response, null, 2),
        description: `Comprehensive statistics for dataset ${args.dataset_id}`,
        mimeType: "application/json"
      });

      // The SDK returns ApiRecords<DatasetTableSummary> with records array
      const records = response.records || [];
      const totalRecords = response.total || records.length;
      
      const formattedStats = [
        `**Dataset Statistics for ${args.dataset_id}**`,
        ``,
        `📊 **Core Metrics:**`,
      ];

      if (records.length > 0) {
        const latestRecord = records[0]; // Most recent statistics
        formattedStats.push(
          `- Active Records: ${latestRecord.active_dataset_stored_records?.toLocaleString() || 'N/A'}`,
          `- Active Files: ${latestRecord.active_dataset_stored_files?.toLocaleString() || 'N/A'}`,
          `- Active Storage: ${latestRecord.active_dataset_stored_bytes ? (latestRecord.active_dataset_stored_bytes / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}`,
          `- Total Records (est): ${latestRecord.est_total_dataset_stored_records?.toLocaleString() || 'N/A'}`,
          `- Total Storage (est): ${latestRecord.est_total_dataset_stored_bytes ? (latestRecord.est_total_dataset_stored_bytes / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}`,
        );

        if (latestRecord.snapshot_created_at) {
          formattedStats.push(`- Last Snapshot: ${new Date(latestRecord.snapshot_created_at).toLocaleDateString()}`);
        }

        if (latestRecord.column_summary && latestRecord.column_summary.length > 0) {
          formattedStats.push(``, `📊 **Column Summary:**`);
          latestRecord.column_summary.slice(0, 5).forEach((col: any) => {
            formattedStats.push(`- ${col.name} (${col.type}): ${col.value_count?.toLocaleString() || 'N/A'} values`);
          });
          
          if (latestRecord.column_summary.length > 5) {
            formattedStats.push(`- ... and ${latestRecord.column_summary.length - 5} more columns`);
          }
        }
      } else {
        formattedStats.push(`- No statistics records found`);
      }

      formattedStats.push(``, `📄 **Summary:**`);
      formattedStats.push(`- Found ${totalRecords} statistics record${totalRecords !== 1 ? 's' : ''}`);
      formattedStats.push(``, `Resource: dataset-statistics://${args.dataset_id}`);

      return {
        content: [
          {
            type: "text",
            text: formattedStats.join('\n')
          },
        ],
      };
    } catch (error) {
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

  private async handleDatasetSample(args: DatasetSampleInput) {
    try {
      const response = await this.apiClient.fetchDatasetSample(args.dataset_id, args.size || 10);
      
      // Store sample as MCP resource for detailed access
      const resourceId = `dataset-sample-${args.dataset_id}`;
      this.resourceManager.setResource(resourceId, {
        id: resourceId,
        name: `Sample data for Dataset ${args.dataset_id}`,
        content: JSON.stringify(response, null, 2),
        description: `Sample records from dataset ${args.dataset_id}`,
        mimeType: "application/json"
      });

      // The SDK returns ApiRecords<Record<string, string>> with records array
      const records = response.records || [];
      const sampleSize = records.length;
      
      const formattedSample = [
        `**Dataset Sample for ${args.dataset_id}**`,
        ``,
        `📊 **Sample Overview:**`,
        `- Records Retrieved: ${sampleSize}`,
        `- Requested Size: ${args.size || 10}`,
      ];

      if (records.length > 0) {
        // Get column names from first record
        const columns = Object.keys(records[0]);
        formattedSample.push(`- Columns Found: ${columns.length}`);
        formattedSample.push(``, `📋 **Column Structure:**`);
        formattedSample.push(columns.map(col => `- ${col}`).join('\n'));
        
        formattedSample.push(``, `📄 **Sample Data (first ${Math.min(3, records.length)} rows):**`);
        
        // Format first few records as a readable table
        const displayRecords = records.slice(0, 3);
        displayRecords.forEach((record: any, index: number) => {
          formattedSample.push(``, `**Row ${index + 1}:**`);
          Object.entries(record).forEach(([column, value]) => {
            const displayValue = value === null || value === undefined ? 'null' : 
                                value === '' ? '(empty)' : 
                                String(value).length > 50 ? String(value).substring(0, 47) + '...' : 
                                String(value);
            formattedSample.push(`  - ${column}: ${displayValue}`);
          });
        });

        if (records.length > 3) {
          formattedSample.push(``, `... and ${records.length - 3} more rows`);
        }
      } else {
        formattedSample.push(`- No sample records found`);
      }

      formattedSample.push(``, `📁 **Full Sample Data:**`);
      formattedSample.push(`Resource: dataset-sample://${args.dataset_id}`);

      return {
        content: [
          {
            type: "text",
            text: formattedSample.join('\n')
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching dataset sample for ${args.dataset_id}: ${error}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleNqlExecute(args: NqlExecuteInput) {
    try {
      const response = await this.apiClient.executeNql(args.query, {
        generateSample: args.generateSample,
        generateStats: args.generateStats,
      });

      // Store job information as a resource for tracking
      const resourceId = `nql-job-${response.jobId}`;
      this.resourceManager.setResource(resourceId, {
        id: resourceId,
        name: `NQL Job ${response.jobId}`,
        content: JSON.stringify({
          jobId: response.jobId,
          sampleJobId: response.sampleJobId,
          statsJobId: response.statsJobId,
          query: args.query,
          status: response.status,
          submittedAt: new Date().toISOString(),
        }, null, 2),
        description: `NQL query execution job`,
        mimeType: "application/json"
      });

      const formattedResponse = [
        `**NQL Query Submitted Successfully** ✓`,
        ``,
        `📋 **Job Information:**`,
        `- Job ID: ${response.jobId}`,
      ];

      if (response.sampleJobId) {
        formattedResponse.push(`- Sample Job ID: ${response.sampleJobId}`);
      }

      if (response.statsJobId) {
        formattedResponse.push(`- Statistics Job ID: ${response.statsJobId}`);
      }

      formattedResponse.push(
        `- Status: ${response.status}`,
        ``,
        `📝 **Query:**`,
        `\`\`\`sql`,
        args.query,
        `\`\`\``,
        ``,
        `⏱️ **Next Steps:**`,
        `Your query is now running asynchronously. Use \`nql_get_results\` to retrieve results once the job completes.`,
        ``,
        `Example:`,
        `- For sample data: \`nql_get_results(jobId="${response.jobId}", resultType="sample")\``,
        `- For statistics: \`nql_get_results(jobId="${response.jobId}", resultType="statistics")\``,
        ``,
        `Resource: nql-job://${response.jobId}`
      );

      return {
        content: [
          {
            type: "text",
            text: formattedResponse.join('\n')
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing NQL query: ${error}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleNqlGetResults(args: NqlGetResultsInput) {
    try {
      const results = await this.apiClient.getJobResults(args.jobId, args.resultType);

      // Store results as a resource for detailed access
      const resourceId = `nql-results-${args.jobId}-${args.resultType}`;
      this.resourceManager.setResource(resourceId, {
        id: resourceId,
        name: `NQL ${args.resultType} results for job ${args.jobId}`,
        content: JSON.stringify(results, null, 2),
        description: `Results from NQL job ${args.jobId}`,
        mimeType: "application/json"
      });

      const formattedResults = [
        `**NQL Job Results** ✓`,
        ``,
        `📋 **Job Information:**`,
        `- Job ID: ${args.jobId}`,
        `- Result Type: ${args.resultType}`,
        ``,
      ];

      if (args.resultType === 'sample') {
        // Format sample results
        const records = results.data || results.records || [];
        formattedResults.push(
          `📊 **Sample Data:**`,
          `- Records: ${records.length}`,
          ``
        );

        if (records.length > 0) {
          const columns = Object.keys(records[0]);
          formattedResults.push(`📋 **Columns (${columns.length}):**`);
          formattedResults.push(columns.map((col: string) => `- ${col}`).join('\n'));
          formattedResults.push(``);

          formattedResults.push(`📄 **Preview (first ${Math.min(3, records.length)} rows):**`);
          records.slice(0, 3).forEach((record: any, index: number) => {
            formattedResults.push(``, `**Row ${index + 1}:**`);
            Object.entries(record).forEach(([column, value]) => {
              const displayValue = value === null || value === undefined ? 'null' : 
                                  value === '' ? '(empty)' : 
                                  String(value).length > 50 ? String(value).substring(0, 47) + '...' : 
                                  String(value);
              formattedResults.push(`  - ${column}: ${displayValue}`);
            });
          });

          if (records.length > 3) {
            formattedResults.push(``, `... and ${records.length - 3} more rows`);
          }
        } else {
          formattedResults.push(`No sample records found.`);
        }
      } else {
        // Format statistics results
        formattedResults.push(`📊 **Statistics:**`);
        formattedResults.push(JSON.stringify(results.data || results, null, 2));
      }

      formattedResults.push(
        ``,
        `📁 **Full Results:**`,
        `Resource: nql-results://${args.jobId}/${args.resultType}`
      );

      return {
        content: [
          {
            type: "text",
            text: formattedResults.join('\n')
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving NQL job results: ${error}`,
          },
        ],
        isError: true,
      };
    }
  }
}
