import { ListResourcesRequestSchema, ListResourceTemplatesRequestSchema, ReadResourceRequestSchema, ErrorCode, McpError, } from "@modelcontextprotocol/sdk/types.js";
export class ResourceHandlers {
    server;
    getResourceManager;
    apiClient;
    constructor(server, getResourceManager, apiClient) {
        this.server = server;
        this.getResourceManager = getResourceManager;
        this.apiClient = apiClient;
    }
    setup() {
        this.setupResourceList();
        this.setupResourceTemplateList();
        this.setupResourceRead();
    }
    setupResourceList() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            const resourceManager = this.getResourceManager();
            return {
                resources: resourceManager.getResourcesForList(),
            };
        });
    }
    setupResourceTemplateList() {
        this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
            const resourceTemplates = [
                {
                    uriTemplate: "dataset://{id}",
                    name: "Dataset Resource",
                    description: "Narrative marketplace dataset details with full schema and metadata",
                    mimeType: "application/json",
                },
                {
                    uriTemplate: "access-rule://{id}",
                    name: "Access Rule Resource",
                    description: "Narrative marketplace access rule details with NQL query and collaboration settings",
                    mimeType: "application/json",
                },
            ];
            return {
                resourceTemplates,
            };
        });
    }
    setupResourceRead() {
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const url = new URL(request.params.uri);
            // Handle ResourceTemplate pattern: dataset://{id}
            if (url.protocol === "dataset:") {
                const datasetId = url.pathname.replace(/^\//, "");
                try {
                    const dataset = await this.apiClient.fetchDatasetById(datasetId);
                    return {
                        contents: [
                            {
                                uri: request.params.uri,
                                mimeType: "application/json",
                                text: JSON.stringify(dataset, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    throw new McpError(ErrorCode.InvalidRequest, `Dataset ${datasetId} not found: ${error}`);
                }
            }
            // Handle ResourceTemplate pattern: access-rule://{id}
            if (url.protocol === "access-rule:") {
                const accessRuleId = parseInt(url.pathname.replace(/^\//, ""), 10);
                if (isNaN(accessRuleId)) {
                    throw new McpError(ErrorCode.InvalidRequest, `Invalid access rule ID: ${url.pathname.replace(/^\//, "")}`);
                }
                try {
                    const accessRule = await this.apiClient.fetchAccessRuleById(accessRuleId);
                    return {
                        contents: [
                            {
                                uri: request.params.uri,
                                mimeType: "application/json",
                                text: JSON.stringify(accessRule, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    throw new McpError(ErrorCode.InvalidRequest, `Access rule ${accessRuleId} not found: ${error}`);
                }
            }
            // Handle legacy resource pattern: resource:///
            if (url.protocol === "resource:") {
                const id = url.pathname.replace(/^\//, "");
                const resourceManager = this.getResourceManager();
                const contents = resourceManager.getResourceContents(id, request.params.uri);
                if (!contents) {
                    throw new McpError(ErrorCode.InvalidRequest, `Resource ${id} not found`);
                }
                return {
                    contents: [contents],
                };
            }
            throw new McpError(ErrorCode.InvalidRequest, `Unsupported URI scheme: ${url.protocol}`);
        });
    }
}
