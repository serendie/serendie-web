import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import mdx from "@astrojs/mdx";
import svgr from "vite-plugin-svgr";
import partytown from "@astrojs/partytown";
import { BASE_PATH } from "./src/utils";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://serendie.design/",
  base: BASE_PATH,

  output: "hybrid",

  integrations: [
    react(),
    mdx(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap(),
  ],

  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  markdown: {
    shikiConfig: {
      theme: "github-light",
      langs: ["ts", "js", "jsx", "tsx", "css", "shell"],
    },
  },

  vite: {
    plugins: [svgr()],
    ssr: {
      noExternal: ["@ark-ui/react", "@serendie/ui"],
    },
    server: {
      cors: true,
    },
  },

  trailingSlash: "never",
  adapter: cloudflare({
    imageService: "compile",
  }),
});
