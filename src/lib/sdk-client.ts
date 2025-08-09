// src/lib/sdk-client.ts
/**
 * Wrapper client for the Narrative Data Collaboration SDK
 * Provides MCP-specific functionality and abstractions
 */

export class NarrativeSDKClient {
  private sdkInstance: any = null;

  constructor(
    private apiUrl: string,
    private apiToken: string
  ) {}

  /**
   * Initialize the SDK instance
   */
  private async initializeSDK(): Promise<void> {
    if (this.sdkInstance) {
      return;
    }

    try {
      const { NarrativeApi } = await import('@narrative.io/data-collaboration-sdk-ts');
      
      // Temporarily suppress console.log to prevent SDK banner from interfering with MCP JSON-RPC
      const originalConsoleLog = console.log;
      console.log = () => {}; // Suppress all console.log output
      
      try {
        this.sdkInstance = new NarrativeApi({ 
          apiKey: this.apiToken,
          environment: this.apiUrl.includes('dev') ? 'dev' : 'prod'
        });
      } finally {
        // Always restore console.log
        console.log = originalConsoleLog;
      }
    } catch (error) {
      console.error('Failed to initialize Narrative SDK:', error);
      throw new Error('SDK initialization failed');
    }
  }

  /**
   * Get SDK client instance for advanced operations
   */
  async getSDKInstance(): Promise<any> {
    await this.initializeSDK();
    return this.sdkInstance;
  }

  /**
   * Check if SDK is properly initialized
   */
  isInitialized(): boolean {
    return this.sdkInstance !== null;
  }

  /**
   * Wrapper methods for common SDK operations
   * These can be expanded as the SDK integration is completed
   */

  async fetchDatasets(): Promise<any[]> {
    await this.initializeSDK();
    return await this.sdkInstance.dataset.getDatasets();
  }

  async searchAttributes(query: string): Promise<any[]> {
    await this.initializeSDK();
    return await this.sdkInstance.attribute.getAttributes({ query });
  }
}