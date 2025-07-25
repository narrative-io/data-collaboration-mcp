// tests/environment-validation.test.ts
import { describe, test, expect } from "bun:test";
import { validateEnvironmentVariables } from "../src/index.js";

describe("Environment Variable Configuration", () => {
  describe("NARRATIVE_API_URL validation", () => {
    test("should throw error when NARRATIVE_API_URL is missing", () => {
      // Arrange
      const testEnv = {
        NARRATIVE_API_TOKEN: "test-token"
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(testEnv);
      }).toThrow("NARRATIVE_API_URL environment variable is required");
    });

    test("should throw error when NARRATIVE_API_URL is empty string", () => {
      // Arrange
      const testEnv = {
        NARRATIVE_API_URL: "",
        NARRATIVE_API_TOKEN: "test-token"
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(testEnv);
      }).toThrow("NARRATIVE_API_URL environment variable is required");
    });

    test("should not throw when NARRATIVE_API_URL is provided", () => {
      // Arrange
      const testEnv = {
        NARRATIVE_API_URL: "https://api.narrative.io",
        NARRATIVE_API_TOKEN: "test-token"
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(testEnv);
      }).not.toThrow();
    });
  });

  describe("NARRATIVE_API_TOKEN validation", () => {
    test("should throw error when NARRATIVE_API_TOKEN is missing", () => {
      // Arrange
      const testEnv = {
        NARRATIVE_API_URL: "https://api.narrative.io"
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(testEnv);
      }).toThrow("NARRATIVE_API_TOKEN environment variable is required");
    });

    test("should throw error when NARRATIVE_API_TOKEN is empty string", () => {
      // Arrange
      const testEnv = {
        NARRATIVE_API_URL: "https://api.narrative.io",
        NARRATIVE_API_TOKEN: ""
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(testEnv);
      }).toThrow("NARRATIVE_API_TOKEN environment variable is required");
    });

    test("should not throw when NARRATIVE_API_TOKEN is provided", () => {
      // Arrange
      const testEnv = {
        NARRATIVE_API_URL: "https://api.narrative.io",
        NARRATIVE_API_TOKEN: "test-token-123"
      };

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(testEnv);
      }).not.toThrow();
    });
  });

  describe("Both environment variables", () => {
    test("should throw error when both environment variables are missing", () => {
      // Arrange
      const testEnv = {};

      // Act & Assert
      expect(() => {
        validateEnvironmentVariables(testEnv);
      }).toThrow("NARRATIVE_API_URL environment variable is required");
    });

    test("should return correct values when both environment variables are provided", () => {
      // Arrange
      const testEnv = {
        NARRATIVE_API_URL: "https://api.narrative.io",
        NARRATIVE_API_TOKEN: "valid-token-12345"
      };

      // Act
      const result = validateEnvironmentVariables(testEnv);

      // Assert
      expect(result.apiUrl).toBe("https://api.narrative.io");
      expect(result.apiToken).toBe("valid-token-12345");
    });
  });
});

describe("Environment Variable Loading", () => {
  test("should use default process.env when no env object is provided", () => {
    // Arrange - Ensure process.env has the required variables
    const originalUrl = process.env.NARRATIVE_API_URL;
    const originalToken = process.env.NARRATIVE_API_TOKEN;
    
    process.env.NARRATIVE_API_URL = "https://test.narrative.io";
    process.env.NARRATIVE_API_TOKEN = "test-token";

    try {
      // Act
      const result = validateEnvironmentVariables();

      // Assert
      expect(result.apiUrl).toBe("https://test.narrative.io");
      expect(result.apiToken).toBe("test-token");
    } finally {
      // Restore original values
      if (originalUrl !== undefined) {
        process.env.NARRATIVE_API_URL = originalUrl;
      } else {
        delete process.env.NARRATIVE_API_URL;
      }
      
      if (originalToken !== undefined) {
        process.env.NARRATIVE_API_TOKEN = originalToken;
      } else {
        delete process.env.NARRATIVE_API_TOKEN;
      }
    }
  });

  test("should handle undefined environment values as missing", () => {
    // Arrange
    const testEnv = {
      NARRATIVE_API_URL: undefined,
      NARRATIVE_API_TOKEN: "test-token"
    };

    // Act & Assert
    expect(() => {
      validateEnvironmentVariables(testEnv);
    }).toThrow("NARRATIVE_API_URL environment variable is required");
  });
});