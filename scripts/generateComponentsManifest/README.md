# Generate Components Manifest

This script generates a JSON manifest file containing metadata about all Serendie UI components.

## Purpose

The script extracts component information from:

- MDX documentation files in `src/content/components/`
- Component props from `@serendie/ui` package using react-docgen-typescript
- Sample code from `src/sampleCode/`
- Storybook URLs from MDX content

## Usage

```bash
npm run build:components
```

## Output

The script generates `src/mcp/data/components-manifest.json` which is used by the MCP server to provide component information to AI assistants.

## Generated Data Structure

Each component in the manifest includes:

- `name`: Component name
- `displayName`: Japanese display name
- `description`: Component description
- `category`: Component category (Actions, Inputs, Layout, Display, Feedback)
- `importPath`: Import path for the component
- `hasStorybook`: Whether the component has Storybook stories
- `lastUpdated`: Last update date
- `props`: Array of component props with type information
- `examples`: Array of code examples
- `storybookUrls`: Array of Storybook URLs

## Dependencies

- `react-docgen-typescript`: For extracting TypeScript component props
- `glob-promise`: For file pattern matching
- `typescript`: For TypeScript AST parsing (fallback)
