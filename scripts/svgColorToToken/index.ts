import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Get directory path for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load color mapping from external JSON file
const mappingFilePath = path.join(__dirname, "svg-color-token-mapping.json");
const mappingData = JSON.parse(fs.readFileSync(mappingFilePath, "utf8"));

interface ColorMapping {
  [key: string]: string[];
}

// Extract the mappings into the format expected by the rest of the code
const colorMapping: ColorMapping = Object.entries(
  mappingData.mappings
).reduce<ColorMapping>((acc, [hex, mapping]) => {
  const mappingData = mapping as { tokens: string[] };
  acc[hex] = mappingData.tokens;
  return acc;
}, {});

// Alternative color formats (uppercase)
const colorMappingUpperCase = Object.entries(colorMapping).reduce<ColorMapping>(
  (acc, [key, value]) => {
    acc[key.toUpperCase()] = value;
    return acc;
  },
  {}
);

// Combined mapping
const allColorMappings = { ...colorMapping, ...colorMappingUpperCase };

interface Replacement {
  original: string;
  token: string;
  cssVariable: string;
  count: number;
}

/**
 * Convert token path to CSS variable
 * Converts camelCase to kebab-case for proper CSS variable naming
 */
export function tokenToCSSVariable(token: string): string {
  // First replace dots with hyphens
  let cssVar = token.replace(/\./g, "-");

  // Then convert camelCase to kebab-case
  // e.g., onChartSurface -> on-chart-surface
  cssVar = cssVar.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  return `var(--colors-${cssVar})`;
}

/**
 * Replace colors in SVG content
 */
export function replaceColors(svgContent: string): {
  content: string;
  replacements: Replacement[];
  remainingHexColors: string[];
} {
  let modifiedContent = svgContent;
  const replacements: Replacement[] = [];

  // Replace each color with its corresponding CSS variable
  Object.entries(allColorMappings).forEach(([hexColor, tokens]) => {
    // Use the first token in the array (primary mapping)
    const primaryToken = tokens[0];
    const cssVariable = tokenToCSSVariable(primaryToken);

    // Count occurrences
    const regex = new RegExp(hexColor.replace("#", "#?"), "gi");
    const matches = modifiedContent.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      modifiedContent = modifiedContent.replace(regex, cssVariable);
      replacements.push({
        original: hexColor,
        token: primaryToken,
        cssVariable: cssVariable,
        count: count,
      });
    }
  });

  // Check for remaining hex colors
  const hexColorRegex = /#[A-Fa-f0-9]{6}/g;
  const remainingMatches = modifiedContent.match(hexColorRegex);
  const remainingHexColors = remainingMatches
    ? [...new Set(remainingMatches)]
    : [];

  return { content: modifiedContent, replacements, remainingHexColors };
}

/**
 * Find SVG files in directory
 */
export function findSVGFiles(
  dirPath: string,
  recursive: boolean = false
): string[] {
  const svgFiles: string[] = [];

  function scanDirectory(currentPath: string): void {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      if (item.isDirectory() && recursive) {
        scanDirectory(fullPath);
      } else if (item.isFile() && item.name.toLowerCase().endsWith(".svg")) {
        svgFiles.push(fullPath);
      }
    }
  }

  scanDirectory(dirPath);
  return svgFiles.sort();
}

/**
 * Process SVG file
 */
export function processSVGFile(
  filePath: string,
  inPlace: boolean = false
): void {
  console.log(`\nProcessing: ${filePath}`);

  try {
    // Read file
    const content = fs.readFileSync(filePath, "utf8");

    // Replace colors
    const {
      content: modifiedContent,
      replacements,
      remainingHexColors,
    } = replaceColors(content);

    if (replacements.length === 0) {
      console.log("No matching colors found in this file.");
      return;
    }

    // Generate output filename
    const outputPath = inPlace
      ? filePath
      : filePath.replace(/\.svg$/i, ".tokenized.svg");

    // Write modified content
    fs.writeFileSync(outputPath, modifiedContent);

    // Report replacements
    console.log(`\nReplacements made:`);
    replacements.forEach(({ original, token, cssVariable, count }) => {
      console.log(`  ${original} → ${token}`);
      console.log(`    CSS Variable: ${cssVariable}`);
      console.log(`    Occurrences: ${count}`);
    });

    console.log(`\nOutput written to: ${outputPath}`);

    // Report remaining hex colors if any
    if (remainingHexColors.length > 0) {
      console.log(
        `\n⚠️  WARNING: Remaining hex colors found that were not replaced:`
      );
      remainingHexColors.forEach((color) => {
        console.log(`  ${color} - Consider adding this to the color mapping`);
      });
      console.log(
        `\nTo add these colors to the mapping, check the Figma design tokens`
      );
      console.log(
        `and update scripts/svgColorToToken/svg-color-token-mapping.json`
      );
    }
  } catch (error) {
    console.error(`Error processing file: ${(error as Error).message}`);
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
SVG Color to Token Converter
============================

This script replaces color values in SVG files with Serendie design token CSS variables.

Usage:
  tsx scripts/svgColorToToken/index.ts <svg-file> [options]
  tsx scripts/svgColorToToken/index.ts --directory <directory> [options]

Options:
  --in-place    Replace the original file instead of creating a new one
  --directory   Process all SVG files in the specified directory
  --recursive   Process SVG files in subdirectories as well (use with --directory)

Examples:
  tsx scripts/svgColorToToken/index.ts chart.svg
  tsx scripts/svgColorToToken/index.ts chart.svg --in-place
  tsx scripts/svgColorToToken/index.ts --directory ./icons
  tsx scripts/svgColorToToken/index.ts --directory ./icons --recursive
  tsx scripts/svgColorToToken/index.ts --directory ./icons --in-place --recursive

Color Mappings:
`);
    Object.entries(colorMapping).forEach(([hex, tokens]) => {
      console.log(`  ${hex} → ${tokens.join(", ")}`);
    });

    process.exit(0);
  }

  const inPlace = args.includes("--in-place");
  const recursive = args.includes("--recursive");
  const directoryIndex = args.indexOf("--directory");

  if (directoryIndex !== -1) {
    // Directory mode
    const dirPath = args[directoryIndex + 1];

    if (!dirPath) {
      console.error("Error: Directory path is required when using --directory");
      process.exit(1);
    }

    processDirectory(dirPath, inPlace, recursive);
  } else {
    // Single file mode
    const filePath = args[0];

    if (!filePath) {
      console.error("Error: File path is required");
      process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      process.exit(1);
    }

    if (!filePath.toLowerCase().endsWith(".svg")) {
      console.error("Error: File must be an SVG file");
      process.exit(1);
    }

    processSVGFile(filePath, inPlace);
  }
}

/**
 * Process all SVG files in directory
 */
export function processDirectory(
  dirPath: string,
  inPlace: boolean = false,
  recursive: boolean = false
): void {
  console.log(`\nProcessing directory: ${dirPath}`);
  console.log(`Recursive: ${recursive}`);
  console.log(`In-place: ${inPlace}`);

  if (!fs.existsSync(dirPath)) {
    console.error(`Error: Directory not found: ${dirPath}`);
    return;
  }

  if (!fs.statSync(dirPath).isDirectory()) {
    console.error(`Error: Path is not a directory: ${dirPath}`);
    return;
  }

  const svgFiles = findSVGFiles(dirPath, recursive);

  if (svgFiles.length === 0) {
    console.log("No SVG files found in the specified directory.");
    return;
  }

  console.log(`\nFound ${svgFiles.length} SVG file(s):`);
  svgFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });

  console.log(`\n${"=".repeat(60)}`);

  svgFiles.forEach((file, index) => {
    console.log(
      `\n[${index + 1}/${svgFiles.length}] Processing: ${path.basename(file)}`
    );
    processSVGFile(file, inPlace);
  });

  console.log(`\n${"=".repeat(60)}`);
  console.log(`\nProcessing complete! ${svgFiles.length} files processed.`);
}
