import "../src/index.css";

import type { Preview, ReactRenderer } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import serendieTokens from "@serendie/design-token/panda";

const defaultTheme = "konjo";

const { themes } = serendieTokens;
const themeNames = [defaultTheme].concat(Object.keys(themes));

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        ...themeNames.reduce((acc, name) => {
          acc[name] = name;
          return acc;
        }, {}),
      },
      defaultTheme,
      attributeName: "data-panda-theme",
    }),
  ],
  tags: ["autodocs"],
};

export default preview;
