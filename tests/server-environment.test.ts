// tests/server-environment.test.ts
import { describe, test, expect } from "bun:test";
import { validateEnvironmentVariables } from "../src/index.js";

describe("MCP Server Environment Configuration", () => {
  describe("Environment Variable Integration", () => {
    test("should validate environment variables during server startup", () => {
      // Arrange
      const validEnv = {
        NARRATIVE_API_URL: "https://api.narrative.io",
        NARRATIVE_API_TOKEN: "test-token-123"
      };

      // Act
      const result = validateEnvironmentVariables(validEnv);

      // Assert
      expect(result.apiUrl).toBe("https://api.narrative.io");
      expect(result.apiToken).toBe("test-token-123");
    });

    test("should fail fast when environment variables are missing during startup", () => {
      // Arrange
      const invalidEnv = {
        // Missing both required variables
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(invalidEnv);
      }).toThrow("NARRATIVE_API_URL environment variable is required");
    });
  });

  describe("API Configuration", () => {
    test("should handle different API URL formats", () => {
      const testCases = [
        {
          url: "https://api.narrative.io",
          token: "token1"
        },
        {
          url: "https://api.narrative.io/",
          token: "token2"
        },
        {
          url: "http://localhost:3000",
          token: "local-token"
        },
        {
          url: "http://localhost:3000/",
          token: "local-token-2"
        }
      ];

      testCases.forEach(testCase => {
        // Arrange
        const testEnv = {
          NARRATIVE_API_URL: testCase.url,
          NARRATIVE_API_TOKEN: testCase.token
        };

        // Act
        const result = validateEnvironmentVariables(testEnv);

        // Assert
        expect(result.apiUrl).toBe(testCase.url);
        expect(result.apiToken).toBe(testCase.token);
      });
    });

    test("should accept various token formats", () => {
      const tokenFormats = [
        "simple-token",
        "Bearer-style-token-with-dashes",
        "jwt.style.token.with.dots",
        "token_with_underscores",
        "UPPERCASE_TOKEN",
        "mixedCaseToken123",
        "very-long-token-that-might-be-used-in-production-environments-with-high-security-requirements"
      ];

      tokenFormats.forEach(token => {
        // Arrange
        const testEnv = {
          NARRATIVE_API_URL: "https://api.narrative.io",
          NARRATIVE_API_TOKEN: token
        };

        // Act & Assert - Should not throw
        expect(() => {
          validateEnvironmentVariables(testEnv);
        }).not.toThrow();

        const result = validateEnvironmentVariables(testEnv);
        expect(result.apiToken).toBe(token);
      });
    });
  });

  describe("Server Error Handling", () => {
    test("should provide clear error messages for missing API URL", () => {
      // Arrange
      const envWithoutUrl = {
        NARRATIVE_API_TOKEN: "test-token"
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(envWithoutUrl);
      }).toThrow("NARRATIVE_API_URL environment variable is required");
    });

    test("should provide clear error messages for missing API token", () => {
      // Arrange
      const envWithoutToken = {
        NARRATIVE_API_URL: "https://api.narrative.io"
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(envWithoutToken);
      }).toThrow("NARRATIVE_API_TOKEN environment variable is required");
    });

    test("should validate environment variables before any server initialization", () => {
      // This test ensures that validation happens early in the startup process
      // preventing partial initialization with invalid configuration

      const invalidConfigs = [
        { NARRATIVE_API_URL: "", NARRATIVE_API_TOKEN: "token" },
        { NARRATIVE_API_URL: "url", NARRATIVE_API_TOKEN: "" },
        { NARRATIVE_API_URL: undefined, NARRATIVE_API_TOKEN: "token" },
        { NARRATIVE_API_URL: "url", NARRATIVE_API_TOKEN: undefined }
      ];

      invalidConfigs.forEach(config => {
        expect(() => {
          validateEnvironmentVariables(config);
        }).toThrow(/environment variable is required/);
      });
    });
  });

  describe("Return Value Structure", () => {
    test("should return object with correct property names", () => {
      // Arrange
      const testEnv = {
        NARRATIVE_API_URL: "https://test.narrative.io",
        NARRATIVE_API_TOKEN: "test-token-xyz"
      };

      // Act
      const result = validateEnvironmentVariables(testEnv);

      // Assert
      expect(result).toHaveProperty("apiUrl");
      expect(result).toHaveProperty("apiToken");
      expect(Object.keys(result)).toEqual(["apiUrl", "apiToken"]);
    });

    test("should return values that match input environment variables", () => {
      // Arrange
      const expectedUrl = "https://production.narrative.io";
      const expectedToken = "prod-token-12345";
      const testEnv = {
        NARRATIVE_API_URL: expectedUrl,
        NARRATIVE_API_TOKEN: expectedToken
      };

      // Act
      const result = validateEnvironmentVariables(testEnv);

      // Assert
      expect(result.apiUrl).toBe(expectedUrl);
      expect(result.apiToken).toBe(expectedToken);
    });
  });
});