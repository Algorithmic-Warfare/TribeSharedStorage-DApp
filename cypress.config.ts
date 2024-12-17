import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    fileServerFolder: "tests",
    fixturesFolder: "tests/fixtures",
    indexHtmlFile: "tests/cypress/support/component-index.html",
    supportFile: "tests/cypress/support/component.ts",
    supportFolder: "tests/cypress/support",
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  viewportHeight: 660,
  viewportWidth: 860,
});
