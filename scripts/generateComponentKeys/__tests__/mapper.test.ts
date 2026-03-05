import { describe, expect, it } from "vitest";
import { buildComponentKeysMap } from "../mapper";
import type { FigmaComponent } from "../types";

describe("buildComponentKeysMap", () => {
  it("コンポーネント情報を現在プロジェクト向けのcomponent-keys形式へ変換できる", () => {
    const componentSets: FigmaComponent[] = [
      {
        key: "set_button",
        name: " Button ",
        description: "button set",
        node_id: "1:1",
      },
      {
        key: "set_modal_dialog",
        name: "Modal Dialog",
        description: "",
        node_id: "1:2",
      },
    ];

    const components: FigmaComponent[] = [
      {
        key: "cmp_badge",
        name: "Badge",
        description: "badge component",
        node_id: "2:1",
      },
      {
        key: "cmp_button_small",
        name: "Button/Small",
        description: "variant child",
        node_id: "2:2",
      },
      {
        key: "cmp_button_duplicate",
        name: "Button",
        description: "duplicate",
        node_id: "2:3",
      },
    ];

    const map = buildComponentKeysMap({
      componentSets,
      components,
      nodeDocumentsById: {
        "1:1": {
          componentPropertyDefinitions: {
            size: { type: "VARIANT", variantOptions: ["Small", "Medium"] },
            disabled: { type: "BOOLEAN", defaultValue: false },
            label: { type: "TEXT", defaultValue: "OK" },
            icon: {
              type: "INSTANCE_SWAP",
              defaultValue: "",
              preferredValues: [
                { type: "COMPONENT_SET", key: "set_modal_dialog" },
                { type: "COMPONENT", key: "cmp_badge" },
              ],
            },
          },
        },
      },
    });

    expect(Object.keys(map).sort()).toEqual([
      "Badge",
      "Button",
      "Modal Dialog",
    ]);
    expect(map.Button).toEqual({
      key: "set_button",
      name: "Button",
      description: "button set",
      nodeId: "1:1",
      type: "COMPONENT_SET",
      componentProperties: [
        {
          name: "size",
          type: "VARIANT",
          options: ["Small", "Medium"],
        },
        {
          name: "disabled",
          type: "BOOLEAN",
          defaultValue: false,
        },
        {
          name: "label",
          type: "TEXT",
          defaultValue: "OK",
        },
        {
          name: "icon",
          type: "INSTANCE_SWAP",
          preferredComponentSets: ["Modal Dialog"],
        },
      ],
    });
    expect(map.Badge?.type).toBe("COMPONENT");
  });

  it("参照解決できないINSTANCE_SWAPは除外する", () => {
    const map = buildComponentKeysMap({
      componentSets: [
        {
          key: "set_button",
          name: "Button",
          description: "",
          node_id: "1:1",
        },
      ],
      components: [],
      nodeDocumentsById: {
        "1:1": {
          componentPropertyDefinitions: {
            icon: {
              type: "INSTANCE_SWAP",
              defaultValue: "",
              preferredValues: [{ type: "COMPONENT_SET", key: "unknown_key" }],
            },
          },
        },
      },
    });

    expect(map.Button?.componentProperties).toBeUndefined();
  });
});
