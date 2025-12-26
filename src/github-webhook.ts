import { Webhooks } from "@octokit/webhooks";
import { serverNixConfig } from "./server-nix-config.ts";
import { git } from "./mini-git.ts";

const REPO_NAME_MAP = {
  "ony.world": "ony-world",
};

export const githubWebhooks = new Webhooks({
  secret: Bun.env.GITHUB_WEBHOOK_SECRET,
});

githubWebhooks.on("push", async (event) => {
  const repoName = event.payload.repository.name;
  const flakeInputName =
    repoName in REPO_NAME_MAP
      ? REPO_NAME_MAP[repoName as keyof typeof REPO_NAME_MAP]
      : repoName;

  await git.pull();
  await serverNixConfig.updateInput(flakeInputName, event.payload.after);

  const isDirty = await git.dirty();
  if (!isDirty) return;

  await serverNixConfig.deploy();
  console.log("Deployed new change of", repoName);

  await git.commitAndPush(`Updated ${repoName}`);
  console.log(`Updated ${repoName}`);
});
