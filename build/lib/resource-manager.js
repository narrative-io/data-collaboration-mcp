/**
 * Enhanced resource manager with better lifecycle management and utilities
 */
export class ResourceManager {
    resources = {};
    constructor(initialResources = {}) {
        this.resources = { ...initialResources };
    }
    /**
     * Add or update a resource
     */
    setResource(id, resource) {
        this.resources[id] = resource;
    }
    /**
     * Get a resource by ID
     */
    getResource(id) {
        return this.resources[id];
    }
    /**
     * Get all resources for internal use
     */
    getAllResources() {
        return { ...this.resources };
    }
    /**
     * Convert internal resources to MCP Resource format for ListResources
     */
    getResourcesForList() {
        return Object.values(this.resources).map(resource => ({
            uri: `resource:///${resource.id}`,
            name: resource.name,
            description: resource.description,
            mimeType: resource.mimeType || "text/plain",
        }));
    }
    /**
     * Convert internal resource to MCP TextResourceContents for ReadResource
     */
    getResourceContents(id, uri) {
        const resource = this.resources[id];
        if (!resource)
            return undefined;
        return {
            uri,
            mimeType: resource.mimeType || "text/plain",
            text: resource.content,
        };
    }
    /**
     * Remove a resource
     */
    removeResource(id) {
        if (id in this.resources) {
            delete this.resources[id];
            return true;
        }
        return false;
    }
    /**
     * Check if a resource exists
     */
    hasResource(id) {
        return id in this.resources;
    }
    /**
     * Clear all resources
     */
    clear() {
        this.resources = {};
    }
    /**
     * Get resource count
     */
    getResourceCount() {
        return Object.keys(this.resources).length;
    }
    /**
     * Add multiple dataset resources from API response
     */
    addDatasetsAsResources(datasets) {
        for (const dataset of datasets) {
            this.setResource(`dataset-${dataset.id}`, {
                id: `dataset-${dataset.id}`,
                name: dataset.name,
                content: JSON.stringify(dataset, null, 2),
                description: `Narrative dataset: ${dataset.description || dataset.name}`,
                mimeType: "application/json",
            });
        }
    }
    /**
     * Add multiple attribute resources from API response
     */
    addAttributesAsResources(attributes) {
        for (const attr of attributes) {
            this.setResource(`attr-${attr.id}`, {
                id: `attr-${attr.id}`,
                name: attr.display_name,
                content: JSON.stringify(attr, null, 2),
                description: `Narrative attribute: ${attr.description || attr.display_name}`,
                mimeType: "application/json",
            });
        }
    }
    /**
     * Get resources by prefix (e.g., all dataset resources)
     */
    getResourcesByPrefix(prefix) {
        const filtered = {};
        for (const [id, resource] of Object.entries(this.resources)) {
            if (id.startsWith(prefix)) {
                filtered[id] = resource;
            }
        }
        return filtered;
    }
}
