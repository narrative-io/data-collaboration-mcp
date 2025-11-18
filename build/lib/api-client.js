import axios from "axios";
import { NarrativeSDKClient } from "./sdk-client.js";
export class NarrativeApiClient {
    apiUrl;
    apiToken;
    sdkClient;
    constructor(apiUrl, apiToken) {
        this.apiUrl = apiUrl;
        this.apiToken = apiToken;
        this.sdkClient = new NarrativeSDKClient(apiUrl, apiToken);
    }
    get headers() {
        return {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
        };
    }
    async fetchAttributes(query = "", page = 1, perPage = 10) {
        const url = new URL(`${this.apiUrl}/attributes`);
        if (query) {
            url.searchParams.append("q", query);
        }
        url.searchParams.append("page", page.toString());
        url.searchParams.append("per_page", perPage.toString());
        try {
            const response = await axios.get(url.toString(), {
                headers: this.headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch attributes: ${error}`);
        }
    }
    async fetchDatasets() {
        const url = new URL(`${this.apiUrl}/datasets`);
        try {
            const response = await axios.get(url.toString(), {
                headers: this.headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch datasets: ${error}`);
        }
    }
    async fetchDatasetById(id) {
        const url = new URL(`${this.apiUrl}/datasets/${id}`);
        try {
            const response = await axios.get(url.toString(), {
                headers: this.headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch dataset ${id}: ${error}`);
        }
    }
    async fetchDatasetStatistics(id) {
        try {
            const sdk = await this.sdkClient.getSDKInstance();
            const datasetId = parseInt(id, 10);
            if (isNaN(datasetId)) {
                throw new Error(`Invalid dataset ID: ${id}. Must be a number.`);
            }
            const statistics = await sdk.getStatistics(datasetId);
            return statistics;
        }
        catch (error) {
            throw new Error(`Failed to fetch dataset statistics for ${id}: ${error}`);
        }
    }
    async fetchDatasetSample(id, size = 10) {
        try {
            const sdk = await this.sdkClient.getSDKInstance();
            const datasetId = parseInt(id, 10);
            if (isNaN(datasetId)) {
                throw new Error(`Invalid dataset ID: ${id}. Must be a number.`);
            }
            if (size < 1 || size > 100) {
                throw new Error(`Invalid sample size: ${size}. Must be between 1 and 100.`);
            }
            const sample = await sdk.getDatasetSample(datasetId, size);
            return sample;
        }
        catch (error) {
            throw new Error(`Failed to fetch dataset sample for ${id}: ${error}`);
        }
    }
    async fetchAccessRules(params) {
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
            const response = await axios.get(url.toString(), {
                headers: this.headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch access rules: ${error}`);
        }
    }
    async searchAccessRules(params) {
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
            const response = await axios.get(url.toString(), {
                headers: this.headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to search access rules: ${error}`);
        }
    }
    async fetchAccessRuleById(id) {
        const url = new URL(`${this.apiUrl}/v2/access-rules/${id}`);
        try {
            const response = await axios.get(url.toString(), {
                headers: this.headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch access rule ${id}: ${error}`);
        }
    }
    /**
     * NQL Execution Methods
     */
    async executeNql(query, options) {
        try {
            const result = await this.sdkClient.executeNql(query, options);
            return result;
        }
        catch (error) {
            // Pass through the error from sdk-client which already has formatted details
            throw error;
        }
    }
    async getJobStatus(jobId) {
        try {
            const status = await this.sdkClient.getJobStatus(jobId);
            return status;
        }
        catch (error) {
            throw new Error(`Failed to get job status for ${jobId}: ${error}`);
        }
    }
    async getJobResults(jobId, resultType) {
        try {
            const results = await this.sdkClient.getJobResults(jobId, resultType);
            return results;
        }
        catch (error) {
            throw new Error(`Failed to get job results for ${jobId}: ${error}`);
        }
    }
}
