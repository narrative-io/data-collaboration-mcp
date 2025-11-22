# Resources Directory

This directory contains external documentation, prompts, and other content files used by the MCP server.

## Structure

```
resources/
├── prompts/          # Prompt templates for AI interactions
│   └── nql-execution.md
└── docs/            # Additional documentation (future use)
```

## Purpose

Separating documentation and prompts from code provides several benefits:
- **Easier Maintenance**: Update content without touching code
- **Better Reviews**: Content changes are isolated in PRs
- **Accessibility**: Non-developers can contribute to documentation
- **Versioning**: Track content changes separately from code logic

## Usage

The server reads these markdown files at runtime to provide context and guidance to AI assistants.

