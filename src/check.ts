import path from "node:path";

function nixCommandExist() {
  return Boolean(Bun.which("nix"));
}

async function validateConfigDir(dir: string) {
  const flake = Bun.file(path.join(dir, "flake.nix"));
  const flakeLock = Bun.file(path.join(dir, "flake.lock"));

  return (await Promise.all([flake.exists(), flakeLock.exists()])).every(
    (check) => check,
  );
}

export async function check(configDir: string) {
  const configExist = await validateConfigDir(configDir);

  if (!nixCommandExist()) {
    throw new Error("nix command not found");
  }

  if (!configExist) {
    throw new Error(
      "Invalid configuration directory, flake.nix or flake.lock does not exist",
    );
  }

  // const tryFlake = await $`nix flake check`.cwd(configDir).quiet();
  // const output = tryFlake.text();
  //
  // if (tryFlake.exitCode !== 0) {
  //   throw output;
  // }
}
