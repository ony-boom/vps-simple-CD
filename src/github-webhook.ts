import { Webhooks } from "@octokit/webhooks";

export const githubWebhooks = new Webhooks({
  secret: Bun.env.GITHUB_WEBHOOK_SECRET!,
});

githubWebhooks.on("push", (event) => {
  const repoName = event.payload.repository.name;
  console.log(repoName);
});
