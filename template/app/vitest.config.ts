import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "wasp/server": path.resolve(import.meta.dirname, "./wasp-server-mock.ts"),
    },
  },
});