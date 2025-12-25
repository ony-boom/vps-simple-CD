import { githubWebhooks } from "./github-webhook";

const server = Bun.serve({
  port: 3002,
  development: Bun.env.NODE_ENV === "development",

  routes: {
    "/gh-webhook": {
      async POST(req) {
        const signature = req.headers.get("X-Hub-Signature-256");
        const payload = await req.text();

        const isAValidRequest =
          signature && (await githubWebhooks.verify(payload, signature));

        const event = req.headers.get("x-github-event");
        const id = req.headers.get("x-github-delivery");

        if (!isAValidRequest || !event || !id) {
          return Response.json(
            {
              message: "No dude!! Nooo",
            },
            { status: 401 },
          );
        }

        await githubWebhooks.receive({
          id,
          name: event as any,
          payload: JSON.parse(payload),
        });

        return Response.json({
          message: "all good",
        });
      },
    },
  },
});

console.log(`Listening on ${server.url}`);
