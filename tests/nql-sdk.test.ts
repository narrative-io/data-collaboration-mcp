// tests/nql-sdk.test.ts
import { describe, test, expect, mock, beforeEach, spyOn } from "bun:test";
import { NarrativeSDKClient } from "../src/lib/sdk-client.js";

describe("NQL SDK Client Methods", () => {
  let sdkClient: NarrativeSDKClient;
  let mockSDKInstance: any;

  beforeEach(async () => {
    // Create a new SDK client for each test
    sdkClient = new NarrativeSDKClient("https://api.narrative.io", "test-token");
    
    // Create mock SDK instance
    mockSDKInstance = {
      nql: {
        execute: mock(() => Promise.resolve({
          jobId: "job_123",
          sampleJobId: "sample_job_456",
          statsJobId: "stats_job_789",
          status: "submitted"
        }))
      },
      jobs: {
        getStatus: mock(() => Promise.resolve({
          id: "job_123",
          status: "completed",
          created_at: "2025-11-18T00:00:00Z"
        })),
        getResults: mock(() => Promise.resolve({
          jobId: "job_123",
          data: [{ column1: "value1" }]
        }))
      }
    };

    // Mock the getSDKInstance method to return our mock
    spyOn(sdkClient, "getSDKInstance").mockResolvedValue(mockSDKInstance);
  });

  describe("executeNql", () => {
    test("should execute NQL query with default options", async () => {
      // Arrange
      const query = "SELECT * FROM dataset_12345 LIMIT 10";

      // Act
      const result = await sdkClient.executeNql(query);

      // Assert
      expect(mockSDKInstance.nql.execute).toHaveBeenCalledTimes(1);
      expect(mockSDKInstance.nql.execute).toHaveBeenCalledWith(query, {
        generateSample: true,
        generateStatistics: true
      });
      expect(result.jobId).toBe("job_123");
      expect(result.status).toBe("submitted");
    });

    test("should execute NQL query with custom options", async () => {
      // Arrange
      const query = "SELECT user_id FROM dataset_12345";
      const options = {
        generateSample: false,
        generateStats: true
      };

      // Act
      const result = await sdkClient.executeNql(query, options);

      // Assert
      expect(mockSDKInstance.nql.execute).toHaveBeenCalledWith(query, {
        generateSample: false,
        generateStatistics: true
      });
    });

    test("should execute NQL query with both flags disabled", async () => {
      // Arrange
      const query = "SELECT * FROM dataset_12345";
      const options = {
        generateSample: false,
        generateStats: false
      };

      // Act
      const result = await sdkClient.executeNql(query, options);

      // Assert
      expect(mockSDKInstance.nql.execute).toHaveBeenCalledWith(query, {
        generateSample: false,
        generateStatistics: false
      });
      expect(result.jobId).toBe("job_123");
    });
  });

  describe("getJobStatus", () => {
    test("should get job status successfully", async () => {
      // Arrange
      const jobId = "job_123";

      // Act
      const status = await sdkClient.getJobStatus(jobId);

      // Assert
      expect(mockSDKInstance.jobs.getStatus).toHaveBeenCalledTimes(1);
      expect(mockSDKInstance.jobs.getStatus).toHaveBeenCalledWith(jobId);
      expect(status.id).toBe("job_123");
      expect(status.status).toBe("completed");
    });

    test("should handle different job statuses", async () => {
      // Arrange
      const jobId = "job_running";
      mockSDKInstance.jobs.getStatus = mock(() => Promise.resolve({
        id: "job_running",
        status: "running",
        created_at: "2025-11-18T00:00:00Z"
      }));

      // Act
      const status = await sdkClient.getJobStatus(jobId);

      // Assert
      expect(status.status).toBe("running");
    });
  });

  describe("getJobResults", () => {
    test("should get job results when job is completed", async () => {
      // Arrange
      const jobId = "job_123";
      const resultType = "sample" as const;

      // Act
      const results = await sdkClient.getJobResults(jobId, resultType);

      // Assert
      expect(mockSDKInstance.jobs.getStatus).toHaveBeenCalledWith(jobId);
      expect(mockSDKInstance.jobs.getResults).toHaveBeenCalledWith(jobId, resultType);
      expect(results.jobId).toBe("job_123");
      expect(results.data).toBeDefined();
    });

    test("should get statistics results when requested", async () => {
      // Arrange
      const jobId = "job_123";
      const resultType = "statistics" as const;
      
      mockSDKInstance.jobs.getResults = mock(() => Promise.resolve({
        jobId: "job_123",
        data: { row_count: 1000, column_count: 5 }
      }));

      // Act
      const results = await sdkClient.getJobResults(jobId, resultType);

      // Assert
      expect(mockSDKInstance.jobs.getResults).toHaveBeenCalledWith(jobId, resultType);
      expect(results.data.row_count).toBe(1000);
    });

    test("should throw error when job is not completed", async () => {
      // Arrange
      const jobId = "job_pending";
      const resultType = "sample" as const;
      
      mockSDKInstance.jobs.getStatus = mock(() => Promise.resolve({
        id: "job_pending",
        status: "running",
        created_at: "2025-11-18T00:00:00Z"
      }));

      // Act & Assert
      await expect(
        sdkClient.getJobResults(jobId, resultType)
      ).rejects.toThrow("Job job_pending is not completed yet");
    });

    test("should throw error when job failed", async () => {
      // Arrange
      const jobId = "job_failed";
      const resultType = "sample" as const;
      
      mockSDKInstance.jobs.getStatus = mock(() => Promise.resolve({
        id: "job_failed",
        status: "failed",
        error: "Query syntax error"
      }));

      // Act & Assert
      await expect(
        sdkClient.getJobResults(jobId, resultType)
      ).rejects.toThrow("Job job_failed is not completed yet");
    });
  });

  describe("SDK Instance Management", () => {
    test("should call getSDKInstance for each operation", async () => {
      // This test verifies that getSDKInstance is called for operations
      const query1 = "SELECT * FROM dataset_1";
      const query2 = "SELECT * FROM dataset_2";

      // Act
      await sdkClient.executeNql(query1);
      await sdkClient.executeNql(query2);

      // Assert - getSDKInstance should be called for each operation
      expect(sdkClient.getSDKInstance).toHaveBeenCalled();
      expect(mockSDKInstance.nql.execute).toHaveBeenCalledTimes(2);
    });
  });
});

