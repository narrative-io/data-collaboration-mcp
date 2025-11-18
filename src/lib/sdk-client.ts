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
  
  try {
    // Use the SDK's NQL execution method with correct parameters
    const result = await sdk.executeNql({
      nql: query,
      data_plane_id: null,  // Use default data plane
    });
    
    // Log the response structure for debugging
    console.error('NQL Execute Result:', JSON.stringify(result, null, 2));
    console.error('NQL Execute Result Keys:', Object.keys(result || {}));
    console.error('NQL Execute Result Type:', typeof result);
    
    return result;
  } catch (error: any) {
    // Extract detailed error information from Narrative API response
    // The mande library structures errors differently
    const errorBody = error?.body || error?.response?.data || error?.data;
    const detail = errorBody?.detail || errorBody?.Detail;
    const title = errorBody?.title || errorBody?.Title;
    const status = error?.statusCode || error?.response?.status || errorBody?.status;
    
    // Build a helpful error message
    let errorMessage = title || error?.message || 'Unknown error';
    if (detail) {
      errorMessage += `\n\nDetail: ${detail}`;
    }
    if (status) {
      errorMessage = `[${status}] ${errorMessage}`;
    }
    
    throw new Error(errorMessage);
  }
}

  /**
   * Get the status of an NQL job
   * @param jobId - The job ID to check
   * @returns Job status information
   */
  async getJobStatus(jobId: string): Promise<any> {
    const sdk = await this.getSDKInstance();
    
    const result = await sdk.getNqlByJobId(jobId);
    
    return result;
  }

  /**
   * Get the results of a completed NQL job
   * @param jobId - The job ID to retrieve results from
   * @param resultType - Type of results to retrieve (sample or statistics)
   * @returns Job results data
   */
  async getJobResults(jobId: string, resultType: 'sample' | 'statistics'): Promise<any> {
    const sdk = await this.getSDKInstance();
    
    // Get the NQL job result which includes the dataset
    const result = await sdk.getNqlByJobId(jobId);
    
    if (result.state !== 'succeeded') {
      throw new Error(`Job ${jobId} is not completed yet. Current status: ${result.state}`);
    }
    
    // If a dataset was created, we can get sample/stats from it
    if (result.input?.dataset?.id) {
      if (resultType === 'sample') {
        return await sdk.getDatasetSample(result.input.dataset.id, 100);
      } else {
        return await sdk.getStatistics(result.input.dataset.id);
      }
    }
    
    return result;
  }
}