import { $ } from "bun";
import * as path from "node:path";

class ServerNixConfig {
  private get configPath() {
    const flakePath = Bun.env.FLAKE_PATH;
    if (!flakePath) {
      throw new Error("FLAKE_PATH environment variable is not defined");
    }
    return path.resolve(flakePath);
  }

  private readonly deployBaseArgs = [
    "nix",
    "--accept-flake-config",
    "run",
    ".#apps.x86_64-linux.colmena",
  ];

  private async getLock() {
    const lock = await $`nix flake --option warn-dirty false metadata --json`
      .cwd(this.configPath)
      .text();
    return JSON.parse(lock);
  }

  private async getInputCurrentState(input: string) {
    const lock = await this.getLock();
    return lock.locks.nodes[input].locked;
  }

  private async shouldUpdate(input: string, revision: string) {
    const inputCurrentState = await this.getInputCurrentState(input);
    return inputCurrentState.rev !== revision;
  }

  async deployLocal() {
    return $`sudo ${this.deployBaseArgs} apply-local`.cwd(this.configPath);
  }

  async updateInput(input: string, revision: string) {
    const shouldUpdate = await this.shouldUpdate(input, revision);
    if (!shouldUpdate) {
      console.warn("Everything is up-to-date");
      return;
    }

    return $`nix flake update ${input}`.cwd(this.configPath);
  }

  async deployRemote() {
    return $`${this.deployBaseArgs} apply`.cwd(this.configPath);
  }

  async deploy() {
    const isDev = Bun.env.NODE_ENV === "development";

    // If in development, we usually deploy to a remote target.
    // In production (on the server), we apply the configuration to the local system.
    if (isDev) {
      return this.deployRemote();
    }

    return this.deployLocal();
  }
}

export const serverNixConfig = new ServerNixConfig();
