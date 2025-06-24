# MCP Server for Serendie Design System

This directory contains the Model Context Protocol (MCP) server implementation for the Serendie Design System documentation.

## Overview

The MCP server allows AI assistants to interact with the Serendie Design System documentation programmatically. It provides tools for:

- Getting list of available symbols/icons from the design system
- Getting detailed information about specific symbols
- Getting design tokens from the design system
- Getting detailed information about specific design tokens
- Getting list of UI components from the design system
- Getting detailed information about specific components
- Health checking the server status

## File Structure

```
src/mcp/
├── server.ts              # Main MCP server configuration
├── tools/                 # Tool implementations
│   ├── symbols.ts         # Symbol list and detail retrieval
│   ├── design-tokens.ts   # Design token list and detail retrieval
│   └── components.ts      # Component list and detail retrieval
├── data/                  # Generated data files
│   └── components-manifest.json  # Auto-generated component manifest (run: npm run build:components)
├── __tests__/            # Test files
│   ├── server.test.ts    # Main server tests
│   ├── components.test.ts # Components tools tests
│   ├── tools/
│   │   ├── symbols.test.ts
│   │   └── design-tokens.test.ts
│   └── outputs/          # Test output files (gitignored)
├── test-client.ts        # Manual test client
└── README.md            # This file
```

## Running Tests

### Unit Tests

Run all tests:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Manual Testing with MCP Client

1. **Start the dev server** (in one terminal):

```bash
npm run dev
```

2. **Run the MCP tests** (in another terminal):

```bash
npm run test:mcp
```

The test client will:

- Check if the dev server is running
- List all available tools
- Test each tool with various parameters
- Save the results to `src/mcp/__tests__/outputs/`

**Note**: The dev server must be running for the MCP tests to work!

## Available MCP Tools

1. **health-check**

   - No parameters required
   - Returns server status and timestamp

2. **get-symbols**

   - Parameters:
     - `search`: string (optional) - Filter symbols by name
     - `limit`: number (optional) - Maximum number of results to return
   - Returns list of available Serendie symbol names:
     - Total count and filtered count
     - Available variants (common to all symbols)
     - Array of symbol names

3. **get-symbol-detail**

   - Parameters:
     - `name`: string (required) - The name of the symbol to get details for
   - Returns detailed information about a specific symbol:
     - Symbol existence check
     - Available variants
     - Import statement
     - Usage examples (basic, outlined, filled)

4. **get-design-tokens**

   - Parameters:
     - `search`: string (optional) - Filter tokens by key (partial match, case-insensitive)
     - `type`: string (optional) - Filter by token type (color, typography, dimension, elevation, radius, spacing, opacity)
     - `category`: string (optional) - Filter by category (reference, system)
     - `theme`: string (optional) - Filter by theme (asagi, konjo, kurikawa, sumire, tsutsuji)
     - `limit`: number (optional) - Maximum number of results to return
   - Returns list of design tokens:
     - Total count and filtered count
     - Returned count (after limit)
     - Available token types
     - Array of token objects with key, path, type, value, originalValue, category, and theme

5. **get-design-token-detail**

   - Parameters:
     - `key`: string (required) - The key of the token to get details for (e.g., "sd.system.color.impression.primaryContainer")
   - Returns detailed information about a specific design token:
     - Token existence check
     - Path array
     - Token type
     - Actual value and original value
     - Category (reference/system/theme)
     - Theme (if applicable)
     - CSS variable format
     - Usage examples (CSS and PandaCSS)
     - Reference information (for system tokens)

6. **get-components**

   - Parameters:
     - `search`: string (optional) - Filter components by name (partial match, case-insensitive)
     - `category`: string (optional) - Filter by category (Actions, Inputs, Layout, Display, Feedback)
     - `limit`: number (optional) - Maximum number of results to return
   - Returns list of Serendie UI components:
     - Total count and filtered count
     - Returned count (after limit)
     - Available categories
     - Array of component summaries with name, displayName, description, and category
   - Note: This tool returns ALL components from @serendie/ui, including those without documentation

7. **get-component-detail**
   - Parameters:
     - `name`: string (required) - The name of the component to get details for (e.g., "Button", "TextField")
   - Returns detailed information about a specific component:
     - Component existence check
     - Display name (Japanese) and description
     - Category and last updated date
     - Documentation URL (if documentation exists)
     - Import statement
     - Props definitions with name, type, required flag, default value, and description
     - Code examples with title, description, code, and filename
     - Storybook URLs with title, path, fullPath, and variant
     - Basic usage examples
     - Related components (components in the same directory/module) with name, displayName, description, and documentation status

## Expected Output Format

Each tool returns a response in the following format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON string with tool-specific data"
    }
  ]
}
```

## Development

### Creating New MCP Tools - Complete Guide

#### 1. Planning Your Tool

Before implementing, consider:

- **Purpose**: What specific functionality does this tool provide?
- **Target Users**: Who will use this tool (AI assistants, developers)?
- **Data Source**: Where will the tool get its data (files, API, computed)?
- **Performance**: Will this tool need caching or optimization?
- **Error Cases**: What could go wrong and how should errors be handled?

#### 2. Naming Conventions

Follow MCP best practices for tool naming:

- Use **kebab-case** (e.g., `get-symbols`, `search-documentation`)
- Start with a **verb** that describes the action (get, search, list, check, validate)
- Be **descriptive** but **concise**
- Examples:
  - ✅ `get-symbols` (clear action + target)
  - ✅ `get-symbol-detail` (action + specific resource)
  - ❌ `symbols` (no verb, unclear)
  - ❌ `getSymbolDetailWithUsageExamples` (too verbose, wrong case)

#### 3. Implementation Steps

1. **Create the tool file** in `src/mcp/tools/your-tool-name.ts`:

   ```typescript
   import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
   import { z } from "zod";

   export function getYourToolName(mcpServer: McpServer) {
     mcpServer.registerTool(
       "your-tool-name",
       {
         title: "Your Tool Title",
         description: "Clear description of what this tool does",
         inputSchema: {
           // Define your parameters here
         },
       },
       async (params) => {
         // Implement your tool logic
       }
     );
   }
   ```

2. **Define input schema** using Zod:

   ```typescript
   inputSchema: {
     requiredParam: z
       .string()
       .describe("Description of this required parameter"),
     optionalParam: z
       .number()
       .optional()
       .describe("Description of this optional parameter"),
   }
   ```

3. **Implement tool logic** with proper error handling:

   ```typescript
   async (params) => {
     try {
       // Your implementation
       const result = await processData(params);

       return {
         content: [
           {
             type: "text",
             text: JSON.stringify(result, null, 2),
           },
         ],
       };
     } catch (error) {
       return {
         content: [
           {
             type: "text",
             text: JSON.stringify({
               error: "Descriptive error message",
               message:
                 error instanceof Error ? error.message : "Unknown error",
             }),
           },
         ],
       };
     }
   };
   ```

4. **Register the tool** in `src/mcp/server.ts`:

   ```typescript
   import { getYourToolName } from "./tools/your-tool-name";

   // In createMcpServer function:
   getYourToolName(mcpServer);
   ```

5. **Create tests** in `src/mcp/__tests__/tools/your-tool-name.test.ts`:

   - Test input validation
   - Test successful execution
   - Test error handling
   - Test edge cases

6. **Update documentation**:
   - Add tool to this README
   - Include parameter descriptions
   - Provide usage examples

#### 4. Best Practices

**Input Validation**:

- Use Zod schemas for type-safe validation
- Provide clear descriptions for each parameter
- Set reasonable defaults for optional parameters
- Validate ranges and formats

**Error Handling**:

- Always wrap logic in try-catch blocks
- Return structured error responses
- Include helpful error messages
- Don't expose sensitive information

**Performance**:

- Consider caching for expensive operations
- Implement pagination for large datasets
- Add reasonable timeouts
- Use streaming for large responses if needed

**Testing**:

- Mock external dependencies
- Test both success and failure cases
- Verify output structure
- Test with realistic data

#### 5. Resources

**MCP Documentation**:

- [MCP Introduction](https://modelcontextprotocol.io/introduction)
- [MCP Tools Concept](https://modelcontextprotocol.io/docs/concepts/tools)
- [MCP Architecture](https://modelcontextprotocol.io/docs/concepts/architecture)
- [MCP TypeScript SDK](https://modelcontextprotocol.io/docs/sdk/typescript)

**Examples in this Project**:

- Tools with multiple functions: `src/mcp/tools/symbols.ts` (list + detail)
- Tools with complex filtering: `src/mcp/tools/design-tokens.ts` (multi-parameter filtering)
- Direct registration: See `health-check` in `src/mcp/server.ts`

#### 6. Common Patterns

**Search/Filter Pattern**:

```typescript
inputSchema: {
  search: z.string().optional().describe("Search query"),
  limit: z.number().optional().describe("Max results"),
  category: z.enum(["a", "b", "c"]).optional().describe("Filter by category"),
}
```

**Resource Retrieval Pattern**:

```typescript
inputSchema: {
  id: z.string().optional().describe("Specific resource ID"),
  includeDetails: z.boolean().optional().describe("Include full details"),
}
```

**Validation Pattern**:

```typescript
inputSchema: {
  data: z.string().describe("Data to validate"),
  schema: z.enum(["type1", "type2"]).describe("Schema to validate against"),
}
```

### API Endpoint

The MCP server is exposed at `/sse` when the dev server is running. It uses HTTP streaming transport for communication with MCP clients.

## Integration

To use this MCP server with an AI assistant:

1. Configure your MCP client to connect to `http://localhost:4321/sse`
2. The server will automatically be available when running `npm run dev`
3. Use the available tools to interact with the Serendie documentation

## Debugging

- Check `src/mcp/__tests__/outputs/` for actual API responses
- Use the browser DevTools Network tab when accessing `/sse`
- Enable debug logging in `src/mcp/server.ts` if needed
- Unit tests use mocked file system operations
- Manual tests use the actual file system and API

## Components Manifest

The components manifest (`src/mcp/data/components-manifest.json`) is automatically generated from the @serendie/ui package. It serves as the primary data source for component information.

### Generation Process

1. **Source**: Scans all components from `@serendie/ui/dist/components/`
2. **Props Extraction**: Uses react-docgen-typescript to extract component props
3. **Documentation**: Supplements with MDX file information when available
4. **Output**: Creates a unified manifest with all component metadata

### Manifest Structure

Each component entry includes:

- `name`: Component name from the UI library
- `displayName`: Japanese display name (from MDX or defaults to name)
- `description`: Component description (from MDX)
- `category`: Component category (Actions, Inputs, Layout, Display, Feedback, Other)
- `hasDocumentation`: Whether MDX documentation exists
- `source`: Data source ("mdx" or "auto-detected")
- `lastUpdated`: Last update date
- `props`: Array of prop definitions with types and descriptions
- `examples`: Code examples (from MDX)
- `storybookUrls`: Storybook URLs (from MDX)

### Rebuilding the Manifest

Run this command to regenerate the manifest:

```bash
npm run build:components
```

This command should be run:

- After updating @serendie/ui package
- After adding/modifying MDX documentation
- As part of the build process

## Troubleshooting

**Common Issues**:

1. **"Dev server is not running"** - Start the dev server with `npm run dev` first
2. **Tool not found** - Ensure the tool is registered in `server.ts`
3. **Invalid parameters** - Check the Zod schema matches your input
4. **Empty responses** - Verify the data source exists and is accessible
