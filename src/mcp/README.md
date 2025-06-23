# MCP Server for Serendie Design System

This directory contains the Model Context Protocol (MCP) server implementation for the Serendie Design System documentation.

## Overview

The MCP server allows AI assistants to interact with the Serendie Design System documentation programmatically. It provides tools for:

- Retrieving design tokens by theme and category
- Getting component information and documentation
- Searching through documentation content
- Health checking the server status

## File Structure

```
src/mcp/
├── server.ts              # Main MCP server configuration
├── tools/                 # Tool implementations
│   ├── design-tokens.ts   # Design token retrieval
│   ├── components.ts      # Component information
│   └── documentation.ts   # Documentation search
├── __tests__/            # Test files
│   ├── server.test.ts    # Main server tests
│   ├── tools/
│   │   ├── design-tokens.test.ts
│   │   ├── components.test.ts
│   │   └── documentation.test.ts
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

2. **get-design-tokens**
   - Parameters:
     - `theme`: "asagi" | "konjo" | "kurikawa" | "sumire" | "tsutsuji" (optional)
     - `category`: "color" | "spacing" | "typography" | "all" (optional)
   - Returns design tokens for the specified theme and category

3. **get-component-info**
   - Parameters:
     - `componentName`: string (optional)
   - Returns component details or list of all components

4. **search-documentation**
   - Parameters:
     - `query`: string (required)
     - `category`: "components" | "pages" | "all" (optional)
     - `limit`: number (optional)
   - Returns search results from documentation

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

### Adding New Tools

1. Create a new tool file in `src/mcp/tools/`
2. Define the tool's input schema using Zod
3. Implement the tool logic
4. Register the tool in `src/mcp/server.ts`
5. Add tests in `src/mcp/__tests__/`
6. Run `npm run test:mcp` to verify

### API Endpoint

The MCP server is exposed at `/api/mcp` when the dev server is running. It uses HTTP streaming transport for communication with MCP clients.

## Integration

To use this MCP server with an AI assistant:

1. Configure your MCP client to connect to `http://localhost:4321/api/mcp`
2. The server will automatically be available when running `npm run dev`
3. Use the available tools to interact with the Serendie documentation

## Debugging

- Check `src/mcp/__tests__/outputs/` for actual API responses
- Use the browser DevTools Network tab when accessing `/api/mcp`
- Enable debug logging in `src/mcp/server.ts` if needed
- Unit tests use mocked file system operations
- Manual tests use the actual file system and API