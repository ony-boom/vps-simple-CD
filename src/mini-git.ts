import { $ } from "bun";
import * as path from "node:path";

class MiniGit {
  private get baseDir() {
    const flakePath = Bun.env.FLAKE_PATH;
    if (!flakePath) {
      throw new Error("FLAKE_PATH environment variable is not defined");
    }
    return path.resolve(flakePath);
  }

  async dirty() {
    return Boolean(await $`git status --porcelain`.cwd(this.baseDir).text());
  }

  async commitAndPush(commitName: string) {
    return $`git add .
    git commit -m "${commitName}"
    git push
    `.cwd(this.baseDir);
  }

  async pull() {
    return $`git pull`.cwd(this.baseDir);
  }
}

export const git = new MiniGit();
