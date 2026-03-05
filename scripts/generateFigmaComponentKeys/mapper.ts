import type {
  ComponentKeyInfo,
  ComponentKeysMap,
  ComponentPropertyDef,
  FigmaComponent,
  FigmaComponentPropertyDefinition,
  FigmaNodeDocument,
} from "./types";

interface BuildComponentKeysMapInput {
  componentSets: FigmaComponent[];
  components: FigmaComponent[];
  nodeDocumentsById: Record<string, FigmaNodeDocument | undefined>;
}

interface ComponentSetIndexes {
  nameByNodeId: Map<string, string>;
  nameByKey: Map<string, string>;
}

/**
 * FigmaのComponent Set情報を、生成JSON用の内部表現へ変換する。
 */
function toComponentSetInfo(componentSet: FigmaComponent): ComponentKeyInfo {
  const name = componentSet.name.trim();
  return {
    key: componentSet.key,
    name,
    description: componentSet.description || "",
    nodeId: componentSet.node_id,
    type: "COMPONENT_SET",
  };
}

/**
 * Component Set一覧からベースマップと検索用インデックスを初期化する。
 */
function initializeComponentSetMap(componentSets: FigmaComponent[]) {
  const componentKeys: ComponentKeysMap = {};
  const indexes: ComponentSetIndexes = {
    nameByNodeId: new Map<string, string>(),
    nameByKey: new Map<string, string>(),
  };

  for (const componentSet of componentSets) {
    const componentSetInfo = toComponentSetInfo(componentSet);
    componentKeys[componentSetInfo.name] = componentSetInfo;
    indexes.nameByNodeId.set(componentSet.node_id, componentSetInfo.name);
    indexes.nameByKey.set(componentSet.key, componentSetInfo.name);
  }

  return { componentKeys, indexes };
}

/**
 * INSTANCE_SWAP定義から、参照可能なComponent Setだけを抽出してプロパティ化する。
 * 解決できる参照がない場合は `null` を返す。
 */
function toInstanceSwapProperty(
  propertyName: string,
  preferredValues: Array<{ type: string; key: string }> | undefined,
  indexes: ComponentSetIndexes
): ComponentPropertyDef | null {
  if (!preferredValues) {
    return null;
  }

  const preferredComponentSets = preferredValues
    .filter((preferredValue) => preferredValue.type === "COMPONENT_SET")
    .map((preferredValue) => indexes.nameByKey.get(preferredValue.key))
    .filter((name): name is string => Boolean(name));

  if (preferredComponentSets.length === 0) {
    return null;
  }

  return {
    name: propertyName,
    type: "INSTANCE_SWAP",
    preferredComponentSets,
  };
}

/**
 * Figmaのプロパティ定義を、component-keys向けのプロパティ型へ変換する。
 * 変換できない定義は `null` を返す。
 */
function toComponentProperty(
  propertyName: string,
  propertyDef: FigmaComponentPropertyDefinition,
  indexes: ComponentSetIndexes
): ComponentPropertyDef | null {
  switch (propertyDef.type) {
    case "VARIANT":
      return {
        name: propertyName,
        type: "VARIANT",
        options: propertyDef.variantOptions,
      };
    case "BOOLEAN":
      return {
        name: propertyName,
        type: "BOOLEAN",
        defaultValue: propertyDef.defaultValue,
      };
    case "TEXT":
      return {
        name: propertyName,
        type: "TEXT",
        defaultValue: propertyDef.defaultValue,
      };
    case "INSTANCE_SWAP":
      return toInstanceSwapProperty(
        propertyName,
        propertyDef.preferredValues,
        indexes
      );
    default:
      return null;
  }
}

/**
 * ノードの `componentPropertyDefinitions` を配列形式へ正規化する。
 */
function extractComponentProperties(
  nodeDocument: FigmaNodeDocument | undefined,
  indexes: ComponentSetIndexes
): ComponentPropertyDef[] {
  const propertyDefinitions = nodeDocument?.componentPropertyDefinitions;
  if (!propertyDefinitions) {
    return [];
  }

  const componentProperties: ComponentPropertyDef[] = [];
  for (const [propertyName, propertyDef] of Object.entries(
    propertyDefinitions
  )) {
    const componentProperty = toComponentProperty(
      propertyName,
      propertyDef,
      indexes
    );
    if (componentProperty) {
      componentProperties.push(componentProperty);
    }
  }

  return componentProperties;
}

/**
 * Component Setノードの定義から、各Component Setへプロパティ情報を反映する。
 */
function mergeComponentSetProperties(
  componentKeys: ComponentKeysMap,
  nodeDocumentsById: Record<string, FigmaNodeDocument | undefined>,
  indexes: ComponentSetIndexes
) {
  for (const [nodeId, nodeDocument] of Object.entries(nodeDocumentsById)) {
    const componentSetName = indexes.nameByNodeId.get(nodeId);
    if (!componentSetName) {
      continue;
    }

    const componentProperties = extractComponentProperties(
      nodeDocument,
      indexes
    );
    if (componentProperties.length > 0) {
      componentKeys[componentSetName].componentProperties = componentProperties;
    }
  }
}

/**
 * Component Setに属さない単体コンポーネントをマップへ追加する。
 * Variant子と重複名は除外する。
 */
function mergeStandaloneComponents(
  componentKeys: ComponentKeysMap,
  components: FigmaComponent[],
  nodeDocumentsById: Record<string, FigmaNodeDocument | undefined>
) {
  const variantNamePattern = /(?:^|,\s*)[^=,\s][^=,]*=[^=,]+/;

  const isNonEmptyString = (
    value: string | null | undefined
  ): value is string => typeof value === "string" && value.trim().length > 0;

  const isComponentSetChild = (component: FigmaComponent): boolean => {
    if (isNonEmptyString(component.component_set_id)) {
      return true;
    }

    const nodeDocument = nodeDocumentsById[component.node_id];
    if (isNonEmptyString(nodeDocument?.componentSetId)) {
      return true;
    }

    return false;
  };

  const isVariantLikeName = (name: string): boolean =>
    name.includes("/") || variantNamePattern.test(name);

  for (const component of components) {
    const name = component.name.trim();
    if (componentKeys[name]) {
      continue;
    }

    if (isComponentSetChild(component)) {
      continue;
    }

    // component_set判定が取れないケースへの保険として、variant子に見える命名を除外する。
    if (isVariantLikeName(name)) {
      continue;
    }

    componentKeys[name] = {
      key: component.key,
      name,
      description: component.description || "",
      nodeId: component.node_id,
      type: "COMPONENT",
    };
  }
}

/**
 * Figma APIレスポンスを、`component-keys.json` 相当のマップへ変換する。
 */
export function buildComponentKeysMap(
  input: BuildComponentKeysMapInput
): ComponentKeysMap {
  const { componentKeys, indexes } = initializeComponentSetMap(
    input.componentSets
  );
  mergeComponentSetProperties(componentKeys, input.nodeDocumentsById, indexes);
  mergeStandaloneComponents(
    componentKeys,
    input.components,
    input.nodeDocumentsById
  );

  return componentKeys;
}
