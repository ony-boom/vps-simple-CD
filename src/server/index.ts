import homepage from "../client/index.html";

export function serve() {
  return Bun.serve({
    port: 3002,
    development: Bun.env.NODE_ENV === "development",

    routes: {
      "/": homepage,
    },
  });
}
