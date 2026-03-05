export type VariantPropertyDef = {
  name: string;
  type: "VARIANT";
  options: string[];
};

export type BooleanPropertyDef = {
  name: string;
  type: "BOOLEAN";
  defaultValue: boolean;
};

export type TextPropertyDef = {
  name: string;
  type: "TEXT";
  defaultValue: string;
};

export type InstanceSwapPropertyDef = {
  name: string;
  type: "INSTANCE_SWAP";
  preferredComponentSets: string[];
};

export type ComponentPropertyDef =
  | VariantPropertyDef
  | BooleanPropertyDef
  | TextPropertyDef
  | InstanceSwapPropertyDef;

export type ComponentKeyInfo = {
  key: string;
  name: string;
  description: string;
  nodeId: string;
  type: "COMPONENT" | "COMPONENT_SET";
  componentProperties?: ComponentPropertyDef[];
};

export type ComponentKeysMap = Record<string, ComponentKeyInfo>;

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  node_id: string;
  component_set_id?: string | null;
}

export interface FigmaComponentsResponse {
  meta?: {
    components?: FigmaComponent[];
  };
}

export interface FigmaComponentSetsResponse {
  meta?: {
    component_sets?: FigmaComponent[];
  };
}

export type FigmaComponentPropertyDefinition =
  | { type: "VARIANT"; variantOptions: string[] }
  | { type: "BOOLEAN"; defaultValue: boolean }
  | { type: "TEXT"; defaultValue: string }
  | {
      type: "INSTANCE_SWAP";
      defaultValue: string;
      preferredValues?: Array<{ type: string; key: string }>;
    };

export interface FigmaNodeDocument {
  componentPropertyDefinitions?: Record<
    string,
    FigmaComponentPropertyDefinition
  >;
  componentSetId?: string;
}

export interface FigmaNodesResponse {
  nodes: Record<
    string,
    {
      document?: FigmaNodeDocument;
    }
  >;
}
