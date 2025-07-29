import type { Resource, StoredResource, TextResourceContents } from "../types/index.js";

/**
 * Enhanced resource manager with better lifecycle management and utilities
 */
export class ResourceManager {
  private resources: Record<string, StoredResource> = {};

  constructor(initialResources: Record<string, StoredResource> = {}) {
    this.resources = { ...initialResources };
  }

  /**
   * Add or update a resource
   */
  setResource(id: string, resource: StoredResource): void {
    this.resources[id] = resource;
  }

  /**
   * Get a resource by ID
   */
  getResource(id: string): StoredResource | undefined {
    return this.resources[id];
  }

  /**
   * Get all resources for internal use
   */
  getAllResources(): Record<string, StoredResource> {
    return { ...this.resources };
  }

  /**
   * Convert internal resources to MCP Resource format for ListResources
   */
  getResourcesForList(): Resource[] {
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
  getResourceContents(id: string, uri: string): TextResourceContents | undefined {
    const resource = this.resources[id];
    if (!resource) return undefined;

    return {
      uri,
      mimeType: resource.mimeType || "text/plain",
      text: resource.content,
    };
  }

  /**
   * Remove a resource
   */
  removeResource(id: string): boolean {
    if (id in this.resources) {
      delete this.resources[id];
      return true;
    }
    return false;
  }

  /**
   * Check if a resource exists
   */
  hasResource(id: string): boolean {
    return id in this.resources;
  }

  /**
   * Clear all resources
   */
  clear(): void {
    this.resources = {};
  }

  /**
   * Get resource count
   */
  getResourceCount(): number {
    return Object.keys(this.resources).length;
  }

  /**
   * Add multiple dataset resources from API response
   */
  addDatasetsAsResources(datasets: Array<{ id: string; name: string; description?: string; [key: string]: any }>): void {
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
  addAttributesAsResources(attributes: Array<{ id: number; display_name: string; description?: string; [key: string]: any }>): void {
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
   * Add multiple access rule resources from API response
   */
  addAccessRulesAsResources(accessRules: Array<{ id: number; name?: string; display_name?: string; description?: string; [key: string]: any }>): void {
    for (const rule of accessRules) {
      const ruleName = rule.display_name || rule.name || `Access Rule ${rule.id}`;
      this.setResource(`access-rule-${rule.id}`, {
        id: `access-rule-${rule.id}`,
        name: ruleName,
        content: JSON.stringify(rule, null, 2),
        description: `Narrative access rule: ${rule.description || ruleName}`,
        mimeType: "application/json",
      });
    }
  }

  /**
   * Get resources by prefix (e.g., all dataset resources)
   */
  getResourcesByPrefix(prefix: string): Record<string, StoredResource> {
    const filtered: Record<string, StoredResource> = {};
    for (const [id, resource] of Object.entries(this.resources)) {
      if (id.startsWith(prefix)) {
        filtered[id] = resource;
      }
    }
    return filtered;
  }
}