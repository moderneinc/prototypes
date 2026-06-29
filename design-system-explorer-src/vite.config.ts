import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Standalone build of the Moderne SaaS/Docs design-system gallery, extracted from
// the marketing-site repo. Same stack (Vite MPA + vite-plugin-handlebars) so it
// stays "built exactly like the real component library". Output is a self-contained
// static folder published by GitHub Pages at /prototypes/design-system/.
const root = dirname(fileURLToPath(import.meta.url));
const web = resolve(root, "web"); // route HTML + src/ + public/ + partials/ live under web/
const p = (rel: string) => resolve(web, rel);

export default defineConfig({
  appType: "mpa",
  root: web,
  // GitHub Pages serves this repo at /prototypes/; this app lives in /design-system/.
  base: "/prototypes/design-system-explorer/",
  plugins: [
    // The DS pages use no marketing content, so the handlebars context is empty —
    // partials are pure static markup inlined at build time.
    handlebars({ partialDirectory: resolve(web, "partials"), context: () => ({}) }),
  ],
  build: {
    target: "es2020",
    // Write the built site to the repo's served folder (../design-system).
    outDir: resolve(root, "../design-system-explorer"),
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: p("index.html"),
        foundations: p("foundations/index.html"),
        accessibility: p("accessibility/index.html"),
        dataviz: p("dataviz/index.html"),
        forms: p("forms/index.html"),
        navigation: p("navigation/index.html"),
        "data-display": p("data-display/index.html"),
        feedback: p("feedback/index.html"),
        examples: p("examples/index.html"),
        "screen-devcenter": p("screens/devcenter/index.html"),
        "screen-activity": p("screens/activity/index.html"),
        "screen-changelog": p("screens/changelog/index.html"),
        "screen-docs-home": p("screens/docs-home/index.html"),
        "screen-docs-platform": p("screens/docs-platform/index.html"),
        "screen-docs-article": p("screens/docs-article/index.html"),
      },
    },
  },
});
