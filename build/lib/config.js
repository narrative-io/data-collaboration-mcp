import dotenv from "dotenv";
dotenv.config();
export function validateEnvironmentVariables(env = process.env) {
    const NARRATIVE_API_URL = env.NARRATIVE_API_URL;
    const NARRATIVE_API_TOKEN = env.NARRATIVE_API_TOKEN;
    if (!NARRATIVE_API_URL) {
        throw new Error("NARRATIVE_API_URL environment variable is required");
    }
    if (!NARRATIVE_API_TOKEN) {
        throw new Error("NARRATIVE_API_TOKEN environment variable is required");
    }
    return {
        apiUrl: NARRATIVE_API_URL,
        apiToken: NARRATIVE_API_TOKEN
    };
}
export const config = validateEnvironmentVariables();
