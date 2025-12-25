import path from "node:path";
import { parseArgs } from "util";

const DEFAULT_CONFIG_DIR = "/etc/nixos";

export function getConfigDir() {
  const { values } = parseArgs({
    args: Bun.argv,

    options: {
      configDir: {
        type: "string",
        short: "c",
        default: "/etc/nixos",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  if (!values.configDir) {
    console.warn("Using default config path", DEFAULT_CONFIG_DIR);
  }

  return path.resolve(values.configDir ?? DEFAULT_CONFIG_DIR);
}
