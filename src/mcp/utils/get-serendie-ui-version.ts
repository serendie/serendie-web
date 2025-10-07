import packageJson from "../../../package.json" assert { type: "json" };

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

/**
 * Resolve the declared version of the @serendie/ui package from package.json.
 */
export function getSerendieUiVersion(): string {
  if (typeof packageJson !== "object" || packageJson === null) {
    return "unknown";
  }

  const { dependencies, devDependencies, peerDependencies } =
    packageJson as PackageJson;

  return (
    dependencies?.["@serendie/ui"] ??
    devDependencies?.["@serendie/ui"] ??
    peerDependencies?.["@serendie/ui"] ??
    "unknown"
  );
}
