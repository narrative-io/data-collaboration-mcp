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

  /**
   * NQL Execution Methods
   */

  /**
   * Execute an NQL query asynchronously
   * @param query - The NQL query string to execute
   * @param options - Optional settings for sample and statistics generation
   * @returns Job information including job IDs for tracking
   */
  async executeNql(
    query: string,
    options?: {
      generateSample?: boolean;
      generateStats?: boolean;
    }
  ): Promise<any> {
    const sdk = await this.getSDKInstance();
    
    // Use the SDK's NQL execution method
    // The SDK should handle job creation and return job IDs
    const result = await sdk.nql.execute(query, {
      generateSample: options?.generateSample ?? true,
      generateStatistics: options?.generateStats ?? true,
    });
    
    return result;
  }

  /**
   * Get the status of a job
   * @param jobId - The job ID to check
   * @returns Job status information
   */
  async getJobStatus(jobId: string): Promise<any> {
    const sdk = await this.getSDKInstance();
    
    const status = await sdk.jobs.getStatus(jobId);
    
    return status;
  }

  /**
   * Get the results of a completed job
   * @param jobId - The job ID to retrieve results from
   * @param resultType - Type of results to retrieve (sample or statistics)
   * @returns Job results data
   */
  async getJobResults(jobId: string, resultType: 'sample' | 'statistics'): Promise<any> {
    // First check if the job is complete
    const status = await this.getJobStatus(jobId);
    
    if (status.status !== 'completed') {
      throw new Error(`Job ${jobId} is not completed yet. Current status: ${status.status}`);
    }
    
    // Retrieve the appropriate results based on type
    const sdk = await this.getSDKInstance();
    const results = await sdk.jobs.getResults(jobId, resultType);
    
    return results;
  }
}