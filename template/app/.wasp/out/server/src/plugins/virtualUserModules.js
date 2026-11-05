import path from "node:path";
import { fileURLToPath } from "node:url";

const serverRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Maps virtual module IDs (pointing to user's server modules)
 * to their relative import paths from the server project root.
 * 
 * @example 
 * serverVirtualUserModuleMap["virtual:wasp/user/env"] // => "../../../src/env"
 *
 * @type {{ [virtualUserModule: string]: string }}
 */
const serverVirtualUserModuleMap = {
  "virtual:wasp/user/env": "../../../src/env",
  "virtual:wasp/user/user/operations": "../../../src/user/operations",
  "virtual:wasp/user/compliance/operations": "../../../src/compliance/operations",
  "virtual:wasp/user/demo-ai-app/operations": "../../../src/demo-ai-app/operations",
  "virtual:wasp/user/payment/operations": "../../../src/payment/operations",
  "virtual:wasp/user/file-upload/operations": "../../../src/file-upload/operations",
  "virtual:wasp/user/analytics/operations": "../../../src/analytics/operations",
};

/**
 * Resolves virtual modules pointing to user's modules.
 * Virtual user modules allow Wasp code to depend on user code at runtime,
 * without depending on the user's project during compile time.
 *
 * @returns {import("rollup").Plugin}
 */
export function virtualUserModules() {
  return {
    name: "wasp:virtual-user-modules",
    async resolveId(id) {
      if (Object.hasOwn(serverVirtualUserModuleMap, id)) {
        const absPath = path.resolve(serverRootDir, serverVirtualUserModuleMap[id]);
        return await this.resolve(absPath, undefined, { skipSelf: true });
      }
      return null;
    },
  };
}
