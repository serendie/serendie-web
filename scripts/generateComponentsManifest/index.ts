import glob from "glob-promise";
import { readFile, writeFile, mkdir, readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as ts from "typescript";
import * as reactDocgen from "react-docgen-typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..", "..");

interface ComponentManifest {
  name: string;
  displayName: string;
  description: string;
  category: string;
  hasDocumentation: boolean;
  source: "auto-detected" | "mdx";
  lastUpdated: string;
  props: PropDefinition[];
  examples: ComponentExample[];
  storybookUrls: StorybookUrl[];
  relatedComponents: string[]; // Names of components in the same directory
}

interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  description?: string;
}

interface ComponentExample {
  title: string;
  description: string;
  code: string;
  fileName: string;
  language: "tsx" | "jsx";
}

interface StorybookUrl {
  title: string;
  path: string;
  variant?: string;
}

// MDXのfrontmatterを解析
async function parseMdxFrontmatter(filePath: string) {
  const content = await readFile(filePath, "utf-8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return null;
  }

  const frontmatter: Record<string, string> = {};
  const lines = frontmatterMatch[1].split("\n");

  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      const value = valueParts.join(":").trim();
      frontmatter[key.trim()] = value.replace(/^["']|["']$/g, "");
    }
  }

  return frontmatter;
}

// MDXからStorybookのパスを抽出
function extractStorybookPaths(content: string): StorybookUrl[] {
  const storybookUrls: StorybookUrl[] = [];
  const storyPathRegex = /storyPath="([^"]+)"/g;
  const titleRegex = /title="([^"]+)"/g;

  const storyPaths = [...content.matchAll(storyPathRegex)];
  const titles = [...content.matchAll(titleRegex)];

  storyPaths.forEach((match, index) => {
    const path = match[1];
    const title = titles[index]?.[1] || "Story";
    const variantMatch = path.match(/--(\w+)$/);

    storybookUrls.push({
      title,
      path,
      variant: variantMatch?.[1],
    });
  });

  return storybookUrls;
}

// サンプルコードを読み込み
async function loadExamples(
  componentName: string
): Promise<ComponentExample[]> {
  const examples: ComponentExample[] = [];
  const sampleDir = join(rootDir, "src", "sampleCode", componentName);

  try {
    const sampleFiles = await glob("*.{tsx,jsx}", { cwd: sampleDir });

    for (const file of sampleFiles) {
      const filePath = join(sampleDir, file);
      const code = await readFile(filePath, "utf-8");
      const fileName = file;

      // タイトルを推測（ファイル名から）
      const title = file
        .replace(/Sample\.(tsx|jsx)$/, "")
        .replace(/([A-Z])/g, " $1")
        .trim();

      examples.push({
        title,
        description: "", // MDXから後で取得
        code,
        fileName,
        language: file.endsWith(".tsx") ? "tsx" : "jsx",
      });
    }
  } catch (_error) {
    // サンプルディレクトリが存在しない場合は空配列を返す
  }

  return examples;
}

// コンポーネントのカテゴリを推測
function guessCategory(componentName: string): string {
  const categories: Record<string, string[]> = {
    Actions: ["Button", "IconButton", "BottomNavigation"],
    Inputs: [
      "TextField",
      "TextArea",
      "CheckBox",
      "RadioButton",
      "RadioGroup",
      "Select",
      "Switch",
      "Search",
      "ChoiceBox",
      "PasswordField",
    ],
    Layout: [
      "Accordion",
      "AccordionGroup",
      "Tabs",
      "TabItem",
      "Divider",
      "List",
      "ListItem",
      "TopAppBar",
    ],
    Display: [
      "Avatar",
      "Badge",
      "NotificationBadge",
      "DashboardWidget",
      "ProgressIndicator",
    ],
    Feedback: [
      "Banner",
      "Toast",
      "Drawer",
      "ModalDialog",
      "DropdownMenu",
      "Pagination",
    ],
  };

  for (const [category, components] of Object.entries(categories)) {
    if (components.includes(componentName)) {
      return category;
    }
  }

  return "Other";
}

// react-docgen-typescriptの設定
const parserOptions = {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop: { parent?: { fileName: string } }) => {
    // Exclude HTML attributes and internal props
    if (prop.parent) {
      return !prop.parent.fileName.includes("node_modules/@types/react");
    }
    return true;
  },
};

// TypeScript AST から Props を抽出
function extractPropsFromAST(
  sourceFile: ts.SourceFile,
  componentName: string
): PropDefinition[] {
  const props: PropDefinition[] = [];
  const typeChecker = ts
    .createProgram([sourceFile.fileName], {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
      skipLibCheck: true,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
    })
    .getTypeChecker();

  function visit(node: ts.Node) {
    // コンポーネントのエクスポート宣言を探す
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const declaration = node.declarationList.declarations[0];
      if (
        ts.isVariableDeclaration(declaration) &&
        declaration.name.getText() === componentName
      ) {
        // 型情報を取得
        const type = typeChecker.getTypeAtLocation(declaration);
        const symbol = type.getSymbol();

        if (symbol) {
          // Props の型を探す
          const propsType = symbol.valueDeclaration
            ? typeChecker.getTypeAtLocation(symbol.valueDeclaration)
            : undefined;

          if (propsType) {
            // 型のプロパティを抽出
            const properties = propsType.getProperties();
            properties.forEach((prop) => {
              const propType = typeChecker.getTypeOfSymbolAtLocation(
                prop,
                prop.valueDeclaration!
              );
              const propTypeString = typeChecker.typeToString(propType);

              props.push({
                name: prop.getName(),
                type: propTypeString,
                required: !(prop.flags & ts.SymbolFlags.Optional),
                description: ts.displayPartsToString(
                  prop.getDocumentationComment(typeChecker)
                ),
              });
            });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return props;
}

// 型定義ファイルからコンポーネントのPropsを解析
async function extractPropsFromTypeDefinition(
  componentName: string
): Promise<PropDefinition[]> {
  try {
    // スペースを除去してCamelCaseに変換
    const normalizedComponentName = componentName.replace(/\s+/g, "");

    // まず react-docgen-typescript を試す
    const componentPaths = [
      join(
        rootDir,
        "node_modules",
        "@serendie/ui",
        "dist",
        "components",
        normalizedComponentName,
        `${normalizedComponentName}.d.ts`
      ),
      join(
        rootDir,
        "node_modules",
        "@serendie/ui",
        "dist",
        "components",
        normalizedComponentName,
        "index.d.ts"
      ),
    ];

    for (const componentPath of componentPaths) {
      try {
        const fileContent = await readFile(componentPath, "utf-8").catch(
          () => null
        );
        if (!fileContent) continue;

        // react-docgen-typescript でパース
        const parser = reactDocgen.parse(componentPath, parserOptions);
        if (parser.length > 0) {
          const componentDoc =
            parser.find((doc) => doc.displayName === normalizedComponentName) ||
            parser[0];
          if (componentDoc && componentDoc.props) {
            console.log(`    ✅ Extracted props using react-docgen-typescript`);
            return Object.entries(componentDoc.props).map(
              ([propName, propInfo]) => ({
                name: propName,
                type: propInfo.type?.name || "unknown",
                required: propInfo.required || false,
                defaultValue: propInfo.defaultValue?.value,
                description: propInfo.description || "",
              })
            );
          }
        }
      } catch (_error) {
        // react-docgen-typescript が失敗した場合は続行
        console.log(
          `    ⚠️  react-docgen-typescript failed for ${componentPath}`
        );
      }
    }

    // react-docgen-typescript が失敗した場合、TypeScript AST を直接解析
    const dtsPath = join(
      rootDir,
      "node_modules",
      "@serendie/ui",
      "dist",
      "components",
      normalizedComponentName,
      `${normalizedComponentName}.d.ts`
    );

    const content = await readFile(dtsPath, "utf-8").catch(() => null);
    if (!content) {
      console.log(`    ⚠️  Component definition file not found`);
      return [];
    }

    // TypeScript AST でパース
    const sourceFile = ts.createSourceFile(
      dtsPath,
      content,
      ts.ScriptTarget.ESNext,
      true
    );

    const astProps = extractPropsFromAST(sourceFile, normalizedComponentName);
    if (astProps.length > 0) {
      console.log(
        `    ✅ Extracted ${astProps.length} props using TypeScript AST`
      );
      return astProps;
    }

    // 型定義から基本的なPropsを推測
    const basicProps: PropDefinition[] = [];
    if (content.includes("styleType")) {
      basicProps.push({
        name: "styleType",
        type: "string",
        required: false,
        description: "コンポーネントの表示スタイル",
      });
    }
    if (content.includes("size")) {
      basicProps.push({
        name: "size",
        type: "string",
        required: false,
        description: "コンポーネントのサイズ",
      });
    }
    basicProps.push({
      name: "className",
      type: "string",
      required: false,
      description: "CSSクラス名",
    });

    if (basicProps.length > 0) {
      console.log(`    ℹ️  Using basic props inference`);
    } else {
      console.log(`    ⚠️  No props found`);
    }
    return basicProps;
  } catch (error) {
    console.log(
      `    ❌ Error extracting props: ${error instanceof Error ? error.message : error}`
    );
    return [];
  }
}

// Helper function to extract sub-components from index.d.ts
async function extractSubComponents(componentPath: string): Promise<string[]> {
  const subComponents: string[] = [];
  try {
    const indexContent = await readFile(
      join(componentPath, "index.d.ts"),
      "utf-8"
    );
    // Match export patterns like: export * from './ComponentName.tsx';
    const exportPattern = /export\s*\*\s*from\s*['"]\.\/([^'"]+)\.tsx['"]/g;
    let match;
    while ((match = exportPattern.exec(indexContent)) !== null) {
      const componentName = match[1];
      // Check if the file actually exists
      try {
        await readFile(join(componentPath, `${componentName}.d.ts`), "utf-8");
        subComponents.push(componentName);
      } catch {
        // File doesn't exist, skip
      }
    }
  } catch {
    // index.d.ts doesn't exist or can't be read
  }
  return subComponents;
}

async function generateManifest() {
  console.log("🔨 Generating components manifest...");

  const components: ComponentManifest[] = [];

  // First, get all components from @serendie/ui
  const componentsDir = join(
    rootDir,
    "node_modules",
    "@serendie/ui",
    "dist",
    "components"
  );
  const componentDirs = await readdir(componentsDir);

  // Create a map of MDX files for quick lookup
  const mdxFiles = await glob("src/content/components/*.mdx", { cwd: rootDir });
  const mdxMap = new Map<string, string>();

  for (const mdxFile of mdxFiles) {
    const mdxPath = join(rootDir, mdxFile);
    const frontmatter = await parseMdxFrontmatter(mdxPath);
    if (frontmatter && frontmatter.title) {
      const normalizedName = frontmatter.title.replace(/\s+/g, "");
      mdxMap.set(normalizedName.toLowerCase(), mdxPath);
    }
  }

  // Process each component directory from the UI library
  for (const componentDirName of componentDirs) {
    const componentPath = join(componentsDir, componentDirName);

    // Get all sub-components in this directory
    const subComponents = await extractSubComponents(componentPath);

    // Process each component (including sub-components)
    for (const componentName of subComponents) {
      console.log(`  🔍 Processing ${componentName}...`);

      // Initialize component data with defaults
      let displayName = componentName;
      let description = "";
      let lastUpdated = new Date().toISOString().split("T")[0];
      let examples: ComponentExample[] = [];
      let storybookUrls: StorybookUrl[] = [];
      let hasDocumentation = false;
      let source: "auto-detected" | "mdx" = "auto-detected";

      // Check if MDX file exists for this component
      const mdxPath = mdxMap.get(componentName.toLowerCase());

      if (mdxPath) {
        hasDocumentation = true;
        source = "mdx";

        const mdxContent = await readFile(mdxPath, "utf-8");
        const frontmatter = await parseMdxFrontmatter(mdxPath);

        if (frontmatter) {
          // Use MDX frontmatter data if available
          displayName =
            frontmatter.componentName || frontmatter.title || componentName;
          description = frontmatter.description || "";
          lastUpdated = frontmatter.lastUpdated || lastUpdated;

          // Load examples
          const mdxComponentName = frontmatter.title || componentName;
          examples = await loadExamples(mdxComponentName);

          // Extract example descriptions from MDX
          examples.forEach((example) => {
            const descRegex = new RegExp(
              `title="${example.title}"[^>]*>[^<]*<[^>]+description="([^"]+)"`,
              "s"
            );
            const match = mdxContent.match(descRegex);
            if (match) {
              example.description = match[1];
            }
          });

          // Extract Storybook paths
          storybookUrls = extractStorybookPaths(mdxContent);
        }
      } else {
        console.log(`    ⚠️  No MDX documentation found`);
      }

      // Extract Props information (works regardless of MDX existence)
      const props = await extractPropsFromTypeDefinition(componentName);

      if (props.length > 0) {
        console.log(`    ✅ Found ${props.length} props`);
      } else {
        console.log(`    ⚠️  No props found`);
      }

      // Get related components (other components in the same directory)
      const relatedComponents = subComponents
        .filter((name) => name !== componentName)
        .filter((name) => name !== "index"); // Exclude index files

      const manifest: ComponentManifest = {
        name: componentName,
        displayName,
        description,
        category: guessCategory(componentName),
        hasDocumentation,
        source,
        lastUpdated,
        props,
        examples,
        storybookUrls,
        relatedComponents,
      };

      components.push(manifest);
    }
  }

  // マニフェストファイルを保存
  const outputDir = join(rootDir, "src", "mcp", "data");
  await mkdir(outputDir, { recursive: true });

  const outputPath = join(outputDir, "components-manifest.json");
  await writeFile(outputPath, JSON.stringify(components, null, 2));

  // Sort components by name for consistency
  components.sort((a, b) => a.name.localeCompare(b.name));

  // Summary statistics
  const documented = components.filter((c) => c.hasDocumentation).length;
  const undocumented = components.length - documented;

  console.log(`\n✅ Generated manifest for ${components.length} components`);
  console.log(`   📄 Documented: ${documented}`);
  console.log(`   ⚠️  Undocumented: ${undocumented}`);
  console.log(`📁 Output: ${outputPath}`);
}

// スクリプトを実行
generateManifest().catch((error) => {
  console.error("❌ Error generating manifest:", error);
  process.exit(1);
});
