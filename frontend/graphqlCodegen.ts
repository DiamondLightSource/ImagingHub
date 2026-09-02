import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,

  schema: ["./src/instrument_sessions.graphql", "./src/workflows.graphql"],
  documents: ["./*/src/components/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,

  generates: {
    "./src/__generated__/types.ts": {
      plugins: ["typescript-operations"],
      config: {
        generateOperationTypes: false,
      },
    },

    "./src/": {
      preset: "near-operation-file",
      plugins: ["typescript-operations"],
      config: {
        importSchemaTypesFrom: "./src/__generated__/types.ts",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
      },
      presetConfig: {
        folder: "__generated__",
      },
    },
  },
};

export default config;
