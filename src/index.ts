import { serve } from "./server";

const server = serve();
console.log(`Listening on ${server.url}`);
