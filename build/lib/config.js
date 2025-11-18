import dotenv from "dotenv";
import path from "path";
/**
 * Environment variable configuration with precedence support.
 *
 * Precedence order (highest to lowest):
 * 1. MCP config `env` field (set before process starts)
 * 2. System environment variables (set in shell/OS)
 * 3. `.env` file in project root (local development)
 *
 * The dotenv.config() call only sets variables that aren't already defined,
 * so it automatically respects the precedence order above.
 */
// Load .env file from project root (won't override existing env vars)
// This supports the standard Node.js convention
dotenv.config({ path: path.join(process.cwd(), ".env") });
/**
 * Determines which configuration source provided each variable.
 * This is useful for debugging configuration issues.
 */
function getConfigurationSources(env = process.env) {
    const sources = [];
    // Check if values came from .env file
    // If they're defined but not in process.env initially, they came from dotenv
    const envContent = (() => {
        try {
            const fs = require("fs");
            const envPath = path.join(process.cwd(), ".env");
            return fs.readFileSync(envPath, "utf-8").split("\n").reduce((acc, line) => {
                const match = line.match(/^([A-Z_]+)=(.*)$/);
                if (match && match[1] && match[2]) {
                    acc[match[1]] = match[2].replace(/^["']|["']$/g, "");
                }
                return acc;
            }, {});
        }
        catch {
            return {};
        }
    })();
    const envSource = { name: ".env file" };
    if (envContent.NARRATIVE_API_URL) {
        envSource.apiUrl = "NARRATIVE_API_URL";
    }
    if (envContent.NARRATIVE_API_TOKEN) {
        envSource.apiToken = "NARRATIVE_API_TOKEN";
    }
    if (envSource.apiUrl || envSource.apiToken) {
        sources.push(envSource);
    }
    const systemSource = { name: "system environment" };
    if (env.NARRATIVE_API_URL && !envContent.NARRATIVE_API_URL) {
        systemSource.apiUrl = "NARRATIVE_API_URL";
    }
    if (env.NARRATIVE_API_TOKEN && !envContent.NARRATIVE_API_TOKEN) {
        systemSource.apiToken = "NARRATIVE_API_TOKEN";
    }
    if (systemSource.apiUrl || systemSource.apiToken) {
        sources.push(systemSource);
    }
    return sources;
}
export function validateEnvironmentVariables(env = process.env) {
    const NARRATIVE_API_URL = env.NARRATIVE_API_URL || "";
    const NARRATIVE_API_TOKEN = env.NARRATIVE_API_TOKEN || "";
    const missing = [];
    if (!NARRATIVE_API_URL) {
        missing.push("NARRATIVE_API_URL");
    }
    if (!NARRATIVE_API_TOKEN) {
        missing.push("NARRATIVE_API_TOKEN");
    }
    if (missing.length > 0) {
        const errorMessage = [
            `Missing required environment variables: ${missing.join(", ")}`,
            "",
            "Configuration sources (in precedence order):",
            "1. MCP config 'env' field",
            "2. System environment variables (e.g., export NARRATIVE_API_TOKEN=...)",
            "3. .env file in project root",
            "",
            "To get started:",
            "  1. Copy .env.template to .env",
            "  2. Fill in your Narrative API credentials in .env",
            "  3. Run the server again",
        ].join("\n");
        throw new Error(errorMessage);
    }
    // Log configuration sources at debug level for troubleshooting
    if (process.env.DEBUG || process.env.MCP_DEBUG) {
        const sources = getConfigurationSources(env);
        if (sources.length > 0) {
            console.error("[MCP Config] Configuration sources:");
            sources.forEach((source) => {
                console.error(`  - ${source.name}`);
                if (source.apiUrl)
                    console.error(`    • ${source.apiUrl}`);
                if (source.apiToken)
                    console.error(`    • ${source.apiToken}`);
            });
        }
    }
    return {
        apiUrl: NARRATIVE_API_URL,
        apiToken: NARRATIVE_API_TOKEN,
    };
}
export const config = validateEnvironmentVariables();
