// tests/nql-types.test.ts
import { describe, test, expect } from "bun:test";
import { 
  NqlExecuteSchema, 
  NqlGetResultsSchema,
  type NqlExecuteInput,
  type NqlGetResultsInput 
} from "../src/types/index.js";

describe("NQL Execute Schema Validation", () => {
  describe("Valid inputs", () => {
    test("should validate minimal valid input with required query", () => {
      const input = {
        query: "SELECT * FROM dataset_12345 LIMIT 10"
      };

      const result = NqlExecuteSchema.parse(input);

      expect(result.query).toBe("SELECT * FROM dataset_12345 LIMIT 10");
      expect(result.generateSample).toBe(true); // Default value
      expect(result.generateStats).toBe(true); // Default value
    });

    test("should validate input with generateSample set to false", () => {
      const input = {
        query: "SELECT * FROM dataset_12345",
        generateSample: false
      };

      const result = NqlExecuteSchema.parse(input);

      expect(result.query).toBe("SELECT * FROM dataset_12345");
      expect(result.generateSample).toBe(false);
      expect(result.generateStats).toBe(true); // Default
    });

    test("should validate input with generateStats set to false", () => {
      const input = {
        query: "SELECT * FROM dataset_12345",
        generateStats: false
      };

      const result = NqlExecuteSchema.parse(input);

      expect(result.query).toBe("SELECT * FROM dataset_12345");
      expect(result.generateSample).toBe(true); // Default
      expect(result.generateStats).toBe(false);
    });

    test("should validate input with both flags set to false", () => {
      const input = {
        query: "SELECT * FROM dataset_12345",
        generateSample: false,
        generateStats: false
      };

      const result = NqlExecuteSchema.parse(input);

      expect(result.query).toBe("SELECT * FROM dataset_12345");
      expect(result.generateSample).toBe(false);
      expect(result.generateStats).toBe(false);
    });

    test("should validate complex NQL query", () => {
      const input = {
        query: `
          SELECT user_id, COUNT(*) as events
          FROM dataset_12345
          WHERE event_type = 'click'
          GROUP BY user_id
          LIMIT 100
        `.trim(),
        generateSample: true,
        generateStats: true
      };

      const result = NqlExecuteSchema.parse(input);

      expect(result.query).toContain("SELECT user_id");
      expect(result.generateSample).toBe(true);
      expect(result.generateStats).toBe(true);
    });
  });

  describe("Invalid inputs", () => {
    test("should fail when query is missing", () => {
      const input = {
        generateSample: true
      };

      expect(() => {
        NqlExecuteSchema.parse(input);
      }).toThrow();
    });

    test("should fail when query is empty string", () => {
      const input = {
        query: ""
      };

      expect(() => {
        NqlExecuteSchema.parse(input);
      }).toThrow();
    });

    test("should fail when query is only whitespace", () => {
      const input = {
        query: "   "
      };

      expect(() => {
        NqlExecuteSchema.parse(input);
      }).toThrow();
    });

    test("should fail when generateSample is not boolean", () => {
      const input = {
        query: "SELECT * FROM dataset_12345",
        generateSample: "true" // String instead of boolean
      };

      expect(() => {
        NqlExecuteSchema.parse(input);
      }).toThrow();
    });

    test("should fail when generateStats is not boolean", () => {
      const input = {
        query: "SELECT * FROM dataset_12345",
        generateStats: 1 // Number instead of boolean
      };

      expect(() => {
        NqlExecuteSchema.parse(input);
      }).toThrow();
    });
  });
});

describe("NQL Get Results Schema Validation", () => {
  describe("Valid inputs", () => {
    test("should validate input with sample result type", () => {
      const input = {
        jobId: "job_12345",
        resultType: "sample" as const
      };

      const result = NqlGetResultsSchema.parse(input);

      expect(result.jobId).toBe("job_12345");
      expect(result.resultType).toBe("sample");
    });

    test("should validate input with statistics result type", () => {
      const input = {
        jobId: "job_67890",
        resultType: "statistics" as const
      };

      const result = NqlGetResultsSchema.parse(input);

      expect(result.jobId).toBe("job_67890");
      expect(result.resultType).toBe("statistics");
    });

    test("should validate UUID-style job IDs", () => {
      const input = {
        jobId: "550e8400-e29b-41d4-a716-446655440000",
        resultType: "sample" as const
      };

      const result = NqlGetResultsSchema.parse(input);

      expect(result.jobId).toBe("550e8400-e29b-41d4-a716-446655440000");
    });
  });

  describe("Invalid inputs", () => {
    test("should fail when jobId is missing", () => {
      const input = {
        resultType: "sample"
      };

      expect(() => {
        NqlGetResultsSchema.parse(input);
      }).toThrow();
    });

    test("should fail when jobId is empty string", () => {
      const input = {
        jobId: "",
        resultType: "sample"
      };

      expect(() => {
        NqlGetResultsSchema.parse(input);
      }).toThrow();
    });

    test("should fail when resultType is missing", () => {
      const input = {
        jobId: "job_12345"
      };

      expect(() => {
        NqlGetResultsSchema.parse(input);
      }).toThrow();
    });

    test("should fail when resultType is invalid", () => {
      const input = {
        jobId: "job_12345",
        resultType: "invalid_type"
      };

      expect(() => {
        NqlGetResultsSchema.parse(input);
      }).toThrow();
    });

    test("should fail when resultType is not a string", () => {
      const input = {
        jobId: "job_12345",
        resultType: 123
      };

      expect(() => {
        NqlGetResultsSchema.parse(input);
      }).toThrow();
    });
  });
});

