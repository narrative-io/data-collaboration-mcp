import axios from "axios";
import type { AttributeResponse, DatasetResponse, Dataset, AccessRulesResponse, AccessRule, ListAccessRulesInput, SearchAccessRulesInput, DatasetStatisticsResponse } from "../types/index.js";

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

  async fetchDatasetStatistics(id: string): Promise<DatasetStatisticsResponse> {
    const url = new URL(`${this.apiUrl}/datasets/${id}/statistics`);
    
    try {
      const response = await axios.get<DatasetStatisticsResponse>(url.toString(), {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch dataset statistics for ${id}: ${error}`);
    }
  }

  async fetchAccessRules(params: ListAccessRulesInput): Promise<AccessRulesResponse> {
    const url = new URL(`${this.apiUrl}/v2/access-rules`);
    
    if (params.owned_only !== undefined) {
      url.searchParams.append("owned_only", params.owned_only.toString());
    }
    if (params.shared_only !== undefined) {
      url.searchParams.append("shared_only", params.shared_only.toString());
    }
    if (params.tag) {
      const tags = Array.isArray(params.tag) ? params.tag : [params.tag];
      tags.forEach(tag => url.searchParams.append("tag", tag));
    }
    if (params.company_id) {
      const companyIds = Array.isArray(params.company_id) ? params.company_id : [params.company_id];
      companyIds.forEach(id => url.searchParams.append("company_id", id.toString()));
    }
    if (params.dataset_id) {
      const datasetIds = Array.isArray(params.dataset_id) ? params.dataset_id : [params.dataset_id];
      datasetIds.forEach(id => url.searchParams.append("dataset_id", id.toString()));
    }
    
    url.searchParams.append("page", params.page.toString());
    url.searchParams.append("per_page", params.per_page.toString());
    
    try {
      const response = await axios.get<AccessRulesResponse>(url.toString(), {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch access rules: ${error}`);
    }
  }

  async searchAccessRules(params: SearchAccessRulesInput): Promise<AccessRulesResponse> {
    const url = new URL(`${this.apiUrl}/v2/access-rules`);
    
    url.searchParams.append("q", params.query);
    
    if (params.owned_only !== undefined) {
      url.searchParams.append("owned_only", params.owned_only.toString());
    }
    if (params.shared_only !== undefined) {
      url.searchParams.append("shared_only", params.shared_only.toString());
    }
    if (params.tag) {
      const tags = Array.isArray(params.tag) ? params.tag : [params.tag];
      tags.forEach(tag => url.searchParams.append("tag", tag));
    }
    if (params.company_id) {
      const companyIds = Array.isArray(params.company_id) ? params.company_id : [params.company_id];
      companyIds.forEach(id => url.searchParams.append("company_id", id.toString()));
    }
    if (params.dataset_id) {
      const datasetIds = Array.isArray(params.dataset_id) ? params.dataset_id : [params.dataset_id];
      datasetIds.forEach(id => url.searchParams.append("dataset_id", id.toString()));
    }
    
    url.searchParams.append("page", params.page.toString());
    url.searchParams.append("per_page", params.per_page.toString());
    
    try {
      const response = await axios.get<AccessRulesResponse>(url.toString(), {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search access rules: ${error}`);
    }
  }

  async fetchAccessRuleById(id: number): Promise<AccessRule> {
    const url = new URL(`${this.apiUrl}/v2/access-rules/${id}`);
    
    try {
      const response = await axios.get<AccessRule>(url.toString(), {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch access rule ${id}: ${error}`);
    }
  }
}