declare module "bun" {
  interface Env {
    GITHUB_WEBHOOK_SECRET: string;
    FLAKE_PATH: string;
  }
}
