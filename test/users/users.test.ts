import { testClient } from "hono/testing";
import { describe, expectTypeOf, it } from "vitest";

import createServer from "../../src/lib/createServer.js";
import router from "../../src/routes/users/index.js";
import env from "../../src/config/envConfig.js";

if(env.NODE_ENV !== "test") {
  
}

describe("Users list", () => {
  it("responds with an array", async () => {
    const client = testClient(createServer().route("/", router));
    const response = await client.users.$get();
    const json = await response.json();
    expectTypeOf(json).toBeArray();
  });
});
