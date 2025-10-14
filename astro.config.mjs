import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import mdx from "@astrojs/mdx";
import svgr from "vite-plugin-svgr";
import partytown from "@astrojs/partytown";
import { getSiteUrl, BASE_PATH } from "./src/utils";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

const siteUrl = getSiteUrl();

// https://astro.build/config
export default defineConfig({
  site: "https://serendie.design/",
  base: BASE_PATH,

  output: "server",

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
