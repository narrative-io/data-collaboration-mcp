import axios from "axios";
export class NarrativeApiClient {
    apiUrl;
    apiToken;
    constructor(apiUrl, apiToken) {
        this.apiUrl = apiUrl;
        this.apiToken = apiToken;
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
}
