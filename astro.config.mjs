import { defineConfig } from "astro/config";

export default defineConfig({
  // Pure static output — zero JS shipped to the browser
  output: "static",

  site: "https://stack.yakbrother.dev",

  // No integrations — no React, no Tailwind, no frameworks
  // Everything is plain Astro components + HTML + CSS
  integrations: [],

  markdown: {
    // Syntax highlighting with no JS — outputs styled <pre> blocks
    shikiConfig: {
      theme: "github-light",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
  },
});
