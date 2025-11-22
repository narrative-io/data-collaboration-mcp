import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

/**
 * Utility class for loading markdown resources from the resources directory
 */
export class ResourceLoader {
  private static resourcesDir: string;

  /**
   * Initialize the resources directory path
   */
  private static getResourcesDir(): string {
    if (!this.resourcesDir) {
      // Get the directory of the current module
      const currentFileUrl = import.meta.url;
      const currentFilePath = fileURLToPath(currentFileUrl);
      const currentDir = dirname(currentFilePath);
      
      // Navigate from src/lib to resources directory
      // When running from build/, we go up to project root
      // When running from src/, we also go up to project root
      this.resourcesDir = join(currentDir, "..", "..", "resources");
    }
    return this.resourcesDir;
  }

  /**
   * Load a markdown file from the resources directory
   * @param relativePath - Path relative to resources directory (e.g., "prompts/nql-execution.md")
   * @returns The contents of the markdown file
   */
  static loadMarkdown(relativePath: string): string {
    try {
      const fullPath = join(this.getResourcesDir(), relativePath);
      return readFileSync(fullPath, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to load resource at ${relativePath}: ${error}`
      );
    }
  }

  /**
   * Load the NQL execution prompt
   * @returns The NQL execution prompt content
   */
  static loadNqlExecutionPrompt(): string {
    return this.loadMarkdown("prompts/nql-execution.md");
  }
}

