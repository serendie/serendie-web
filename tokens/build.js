import StyleDictionary from "style-dictionary-utils";
import {
  registerAll,
  customFileHeader,
} from "@serendie/style-dictionary-formatter";

registerAll();

StyleDictionary.extend({
  source: ["tokens/data/**/*.json"],
  platforms: {
    css: {
      options: {
        fileHeader: customFileHeader,
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
      options: {
        fileHeader: customFileHeader,
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
