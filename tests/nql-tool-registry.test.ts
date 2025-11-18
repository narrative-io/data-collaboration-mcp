// tests/nql-tool-registry.test.ts
import { describe, test, expect } from "bun:test";
import { ToolRegistry } from "../src/lib/tool-registry.js";

describe("NQL Tool Registry", () => {
  describe("Tool Definitions", () => {
    test("should include nql_execute tool in getAllTools", () => {
      const tools = ToolRegistry.getAllTools();
      const nqlExecute = tools.find(t => t.name === "nql_execute");

      expect(nqlExecute).toBeDefined();
      expect(nqlExecute?.name).toBe("nql_execute");
      expect(nqlExecute?.description).toContain("NQL");
      expect(nqlExecute?.description).toContain("asynchronously");
    });

    test("should include nql_get_results tool in getAllTools", () => {
      const tools = ToolRegistry.getAllTools();
      const nqlGetResults = tools.find(t => t.name === "nql_get_results");

      expect(nqlGetResults).toBeDefined();
      expect(nqlGetResults?.name).toBe("nql_get_results");
      expect(nqlGetResults?.description).toContain("results");
      expect(nqlGetResults?.description).toContain("completed");
    });

    test("nql_execute should have correct input schema", () => {
      const tool = ToolRegistry.getTool("nql_execute");

      expect(tool).toBeDefined();
      expect(tool?.inputSchema).toHaveProperty("properties");
      
      const schema = tool?.inputSchema as any;
      expect(schema.properties.query).toBeDefined();
      expect(schema.properties.query.type).toBe("string");
      expect(schema.properties.generateSample).toBeDefined();
      expect(schema.properties.generateSample.type).toBe("boolean");
      expect(schema.properties.generateStats).toBeDefined();
      expect(schema.properties.generateStats.type).toBe("boolean");
      expect(schema.required).toContain("query");
    });

    test("nql_get_results should have correct input schema", () => {
      const tool = ToolRegistry.getTool("nql_get_results");

      expect(tool).toBeDefined();
      expect(tool?.inputSchema).toHaveProperty("properties");
      
      const schema = tool?.inputSchema as any;
      expect(schema.properties.jobId).toBeDefined();
      expect(schema.properties.jobId.type).toBe("string");
      expect(schema.properties.resultType).toBeDefined();
      expect(schema.properties.resultType.enum).toEqual(["sample", "statistics"]);
      expect(schema.required).toContain("jobId");
      expect(schema.required).toContain("resultType");
    });
  });

  describe("NQL Execute Input Validation", () => {
    test("should validate valid nql_execute input", () => {
      const input = {
        query: "SELECT * FROM dataset_12345 LIMIT 10"
      };

      const result = ToolRegistry.validateToolInput("nql_execute", input);

      expect(result).toBeDefined();
      expect((result as any).query).toBe("SELECT * FROM dataset_12345 LIMIT 10");
      expect((result as any).generateSample).toBe(true); // default
      expect((result as any).generateStats).toBe(true); // default
    });

    test("should validate nql_execute input with custom options", () => {
      const input = {
        query: "SELECT user_id FROM dataset_12345",
        generateSample: false,
        generateStats: true
      };

      const result = ToolRegistry.validateToolInput("nql_execute", input);

      expect(result).toBeDefined();
      expect((result as any).query).toBe("SELECT user_id FROM dataset_12345");
      expect((result as any).generateSample).toBe(false);
      expect((result as any).generateStats).toBe(true);
    });

    test("should trim whitespace from nql_execute query", () => {
      const input = {
        query: "  SELECT * FROM dataset_12345  "
      };

      const result = ToolRegistry.validateToolInput("nql_execute", input);

      expect((result as any).query).toBe("SELECT * FROM dataset_12345");
    });

    test("should throw error for empty nql_execute query", () => {
      const input = {
        query: ""
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_execute", input);
      }).toThrow();
    });

    test("should throw error for whitespace-only nql_execute query", () => {
      const input = {
        query: "   "
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_execute", input);
      }).toThrow();
    });

    test("should throw error for missing nql_execute query", () => {
      const input = {
        generateSample: true
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_execute", input);
      }).toThrow();
    });

    test("should throw error for invalid generateSample type", () => {
      const input = {
        query: "SELECT * FROM dataset_12345",
        generateSample: "true" // String instead of boolean
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_execute", input);
      }).toThrow();
    });
  });

  describe("NQL Get Results Input Validation", () => {
    test("should validate valid nql_get_results input with sample type", () => {
      const input = {
        jobId: "job_12345",
        resultType: "sample"
      };

      const result = ToolRegistry.validateToolInput("nql_get_results", input);

      expect(result).toBeDefined();
      expect((result as any).jobId).toBe("job_12345");
      expect((result as any).resultType).toBe("sample");
    });

    test("should validate valid nql_get_results input with statistics type", () => {
      const input = {
        jobId: "job_67890",
        resultType: "statistics"
      };

      const result = ToolRegistry.validateToolInput("nql_get_results", input);

      expect(result).toBeDefined();
      expect((result as any).jobId).toBe("job_67890");
      expect((result as any).resultType).toBe("statistics");
    });

    test("should trim whitespace from jobId", () => {
      const input = {
        jobId: "  job_12345  ",
        resultType: "sample"
      };

      const result = ToolRegistry.validateToolInput("nql_get_results", input);

      expect((result as any).jobId).toBe("job_12345");
    });

    test("should throw error for empty jobId", () => {
      const input = {
        jobId: "",
        resultType: "sample"
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_get_results", input);
      }).toThrow();
    });

    test("should throw error for whitespace-only jobId", () => {
      const input = {
        jobId: "   ",
        resultType: "sample"
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_get_results", input);
      }).toThrow();
    });

    test("should throw error for missing jobId", () => {
      const input = {
        resultType: "sample"
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_get_results", input);
      }).toThrow();
    });

    test("should throw error for missing resultType", () => {
      const input = {
        jobId: "job_12345"
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_get_results", input);
      }).toThrow();
    });

    test("should throw error for invalid resultType", () => {
      const input = {
        jobId: "job_12345",
        resultType: "invalid_type"
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_get_results", input);
      }).toThrow();
    });

    test("should throw error for numeric resultType", () => {
      const input = {
        jobId: "job_12345",
        resultType: 123
      };

      expect(() => {
        ToolRegistry.validateToolInput("nql_get_results", input);
      }).toThrow();
    });
  });

  describe("Tool Registry Integration", () => {
    test("should validate nql_execute through generic validateToolInput", () => {
      const input = {
        query: "SELECT * FROM dataset_12345"
      };

      const result = ToolRegistry.validateToolInput("nql_execute", input);

      expect(result).toBeDefined();
      expect((result as any).query).toBe("SELECT * FROM dataset_12345");
    });

    test("should validate nql_get_results through generic validateToolInput", () => {
      const input = {
        jobId: "job_12345",
        resultType: "sample"
      };

      const result = ToolRegistry.validateToolInput("nql_get_results", input);

      expect(result).toBeDefined();
      expect((result as any).jobId).toBe("job_12345");
    });

    test("should throw error for unknown tool name", () => {
      const input = { query: "test" };

      expect(() => {
        ToolRegistry.validateToolInput("unknown_tool", input);
      }).toThrow("Unknown tool");
    });
  });
});

