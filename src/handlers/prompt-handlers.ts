import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import type { Prompt, PromptMessage } from "@modelcontextprotocol/sdk/types.js";
import { ResourceLoader } from "../lib/resource-loader.js";

export class PromptHandlers {
  constructor(private server: Server) {}

  setup(): void {
    this.setupPromptsList();
    this.setupGetPrompt();
  }

  private setupPromptsList(): void {
    this.server.setRequestHandler(
      ListPromptsRequestSchema,
      async () => ({
        prompts: this.getAllPrompts(),
      })
    );
  }

  private setupGetPrompt(): void {
    this.server.setRequestHandler(
      GetPromptRequestSchema,
      async (request) => {
        const promptName = request.params.name;
        
        switch (promptName) {
          case "execute-nql":
            return this.getNqlExecutionPrompt(request.params.arguments);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown prompt: ${promptName}`
            );
        }
      }
    );
  }

  private getAllPrompts(): Prompt[] {
    return [
      {
        name: "execute-nql",
        description: "Expert guidance for executing NQL queries on the Narrative platform. This prompt ensures queries follow all mandatory NQL syntax rules, namespace conventions, and best practices.",
        arguments: [
          {
            name: "query",
            description: "The NQL query you want to execute or validate",
            required: false,
          },
        ],
      },
    ];
  }

  private getNqlExecutionPrompt(args?: Record<string, string>): { messages: PromptMessage[] } {
    const query = args?.query || "";
    
    // Load the prompt content from the markdown file
    const promptContent = ResourceLoader.loadNqlExecutionPrompt();

    const messages: PromptMessage[] = [
      {
        role: "user",
        content: {
          type: "text",
          text: promptContent + (query ? `\n\n---------------------------\nQUERY TO VALIDATE/EXECUTE:\n---------------------------\n\n${query}` : ""),
        },
      },
    ];

    return { messages };
  }
}

