import axios from "axios";
import type { AttributeResponse, DatasetResponse, Dataset } from "../types/index.js";

export class NarrativeApiClient {
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(apiUrl: string, apiToken: string) {
    this.apiUrl = apiUrl;
    this.apiToken = apiToken;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  async fetchAttributes(
    query: string = "", 
    page: number = 1, 
    perPage: number = 10
  ): Promise<AttributeResponse> {
    const url = new URL(`${this.apiUrl}/attributes`);
    
    if (query) {
      url.searchParams.append("q", query);
    }
    
    url.searchParams.append("page", page.toString());
    url.searchParams.append("per_page", perPage.toString());
    
    try {
      const response = await axios.get<AttributeResponse>(url.toString(), {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch attributes: ${error}`);
    }
  }

  async fetchDatasets(): Promise<DatasetResponse> {
    const url = new URL(`${this.apiUrl}/datasets`);
    
    try {
      const response = await axios.get<DatasetResponse>(url.toString(), {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch datasets: ${error}`);
    }
  }

  async fetchDatasetById(id: string): Promise<Dataset> {
    const url = new URL(`${this.apiUrl}/datasets/${id}`);
    
    try {
      const response = await axios.get<Dataset>(url.toString(), {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch dataset ${id}: ${error}`);
    }
  }
}