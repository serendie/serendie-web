import StyleDictionary from "style-dictionary-utils";
import {
  registerAll,
  customFileHeader,
} from "@serendie/style-dictionary-formatter";

import defaultTokens from "@serendie/design-token";

registerAll();

StyleDictionary.extend({
  source: ["tokens/data/**/*.json"],
  tokens: {
    ...defaultTokens,
  },
  platforms: {
    css: {
      buildPath: "tokens/generated/",
      options: {
        fileHeader: customFileHeader,
        outputReferences: false,
      },
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "color/css",
        "serendie/cssShadow",
        "serendie/cssTypography",
        "serendie/robotoToInherit",
      ],
      files: [
        {
          destination: "tokens.css",
          format: "serendie/cssWithTheme",
        },
      ],
    },
    js: {
      buildPath: "tokens/generated/",
      options: {
        fileHeader: customFileHeader,
        outputReferences: false,
      },
      transforms: [
        "attribute/cti",
        "name/cti/camel",
        "time/seconds",
        "content/icon",
        "color/css",
        "serendie/robotoToInherit",
      ],
      files: [
        {
          destination: "panda-tokens.js",
          format: "serendie/pandaToken",
        },
        {
          destination: "panda-tokens.d.ts",
          format: "serendie/pandaTokenDeclarations",
        },
      ],
    },
  },
}).buildAllPlatforms();
