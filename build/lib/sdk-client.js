// src/lib/sdk-client.ts
/**
 * Wrapper client for the Narrative Data Collaboration SDK
 * Provides MCP-specific functionality and abstractions
 */
export class NarrativeSDKClient {
    apiUrl;
    apiToken;
    sdkInstance = null;
    constructor(apiUrl, apiToken) {
        this.apiUrl = apiUrl;
        this.apiToken = apiToken;
    }
    /**
     * Initialize the SDK instance
     */
    async initializeSDK() {
        if (this.sdkInstance) {
            return;
        }
        try {
            const { NarrativeApi } = await import('@narrative.io/data-collaboration-sdk-ts');
            this.sdkInstance = new NarrativeApi({
                apiKey: this.apiToken,
                environment: this.apiUrl.includes('dev') ? 'dev' : 'prod'
            });
        }
        catch (error) {
            console.error('Failed to initialize Narrative SDK:', error);
            throw new Error('SDK initialization failed');
        }
    }
    /**
     * Get SDK client instance for advanced operations
     */
    async getSDKInstance() {
        await this.initializeSDK();
        return this.sdkInstance;
    }
    /**
     * Check if SDK is properly initialized
     */
    isInitialized() {
        return this.sdkInstance !== null;
    }
    /**
     * Wrapper methods for common SDK operations
     * These can be expanded as the SDK integration is completed
     */
    async fetchDatasets() {
        await this.initializeSDK();
        return await this.sdkInstance.dataset.getDatasets();
    }
    async searchAttributes(query) {
        await this.initializeSDK();
        return await this.sdkInstance.attribute.getAttributes({ query });
    }
}
