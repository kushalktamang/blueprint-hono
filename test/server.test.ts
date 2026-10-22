import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import env from "../src/config/envConfig.js";
import server from "../src/server.js";

const databaseState = vi.hoisted(() => ({
  nextId: 1,
  users: [] as Array<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }>,
}));

vi.mock("../src/database/database.js", () => ({
  default: {
    query: {
      users: {
        findMany: async () => databaseState.users,
        findFirst: async ({ where }: { where: { id: number } }) =>
          databaseState.users.find((user) => user.id === where.id),
      },
    },
    insert: () => ({
      values: (input: { name: string; email: string }) => ({
        returning: async () => {
          const now = new Date();
          const user = { id: databaseState.nextId++, ...input, createdAt: now, updatedAt: now };
          databaseState.users.push(user);
          return [user];
        },
      }),
    }),
    update: () => ({
      set: (changes: Partial<(typeof databaseState.users)[number]>) => ({
        where: () => ({
          returning: async () => {
            const user = databaseState.users[0];
            if (user === undefined) {
              return [];
            }

            Object.assign(user, changes, { updatedAt: new Date() });
            return [user];
          },
        }),
      }),
    }),
    delete: () => ({
      where: () => ({
        returning: async () => {
          const user = databaseState.users.shift();
          return user === undefined ? [] : [{ id: user.id }];
        },
      }),
    }),
  },
}));

const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const openApiDocumentSchema = z.object({
  openapi: z.string(),
  info: z.object({ title: z.string(), version: z.string() }),
  paths: z.record(z.string(), z.unknown()),
});

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("API", () => {
  beforeEach(() => {
    databaseState.nextId = 1;
    databaseState.users.length = 0;
  });

  it("serves the index and health check with request IDs", async () => {
    const indexResponse = await server.request("/");
    expect(indexResponse.status).toBe(200);
    expect(await indexResponse.json()).toEqual({ message: "Blueprint Hono Server" });
    expect(indexResponse.headers.get("X-Request-Id")).toBeTruthy();

    const healthResponse = await server.request("/healthz");
    expect(healthResponse.status).toBe(200);
    expect(await healthResponse.json()).toEqual({ message: "OK" });
    expect(healthResponse.headers.get("X-Request-Id")).toBeTruthy();
  });

  it("publishes the OpenAPI document and interactive reference", async () => {
    const documentResponse = await server.request("/docs");
    expect(documentResponse.status).toBe(200);

    const document = openApiDocumentSchema.parse(await documentResponse.json());
    expect(document).toMatchObject({
      openapi: "3.0.0",
      info: { title: "Blueprint Hono", version: "1.0.0" },
    });
    expect(document.paths).toHaveProperty("/users");
    expect(document.paths).toHaveProperty("/users/{id}");
    expect(document.paths).toHaveProperty("/healthz");

    const referenceResponse = await server.request("/reference");
    expect(referenceResponse.status).toBe(200);
    expect(referenceResponse.headers.get("content-type")).toContain("text/html");
  });

  it("creates, lists, reads, updates, and deletes a user", async () => {
    const email = `test-${randomUUID()}@example.com`;
    let userId: number | undefined;
    let deleted = false;

    try {
      const createResponse = await server.request("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Ada Lovelace", email: email.toUpperCase() }),
      });

      expect(createResponse.status).toBe(200);
      const created = userResponseSchema.parse(await createResponse.json());
      expect(created).toMatchObject({ name: "Ada Lovelace", email });
      expect(created).toHaveProperty("id");
      expect(created).toHaveProperty("createdAt");
      expect(created).toHaveProperty("updatedAt");
      userId = created.id;

      const listResponse = await server.request("/users");
      expect(listResponse.status).toBe(200);
      expect(await listResponse.json()).toContainEqual(created);

      const getResponse = await server.request(`/users/${userId}`);
      expect(getResponse.status).toBe(200);
      expect(await getResponse.json()).toEqual(created);

      const patchResponse = await server.request(`/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Ada Byron" }),
      });
      expect(patchResponse.status).toBe(200);
      const updated = userResponseSchema.parse(await patchResponse.json());
      expect(updated).toMatchObject({ id: userId, name: "Ada Byron", email });

      const deleteResponse = await server.request(`/users/${userId}`, { method: "DELETE" });
      expect(deleteResponse.status).toBe(204);
      expect(await deleteResponse.text()).toBe("");
      deleted = true;

      const missingResponse = await server.request(`/users/${userId}`);
      expect(missingResponse.status).toBe(404);
      expect(await missingResponse.json()).toMatchObject({ message: "Not Found" });
    } finally {
      if (userId !== undefined && !deleted) {
        await server.request(`/users/${userId}`, { method: "DELETE" });
      }
    }
  });

  it("rejects invalid user input and IDs", async () => {
    const invalidCreateResponse = await server.request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: " ", email: "not-an-email" }),
    });
    expect(invalidCreateResponse.status).toBe(422);

    const invalidPatchResponse = await server.request("/users/not-an-id", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated" }),
    });
    expect(invalidPatchResponse.status).toBe(422);

    const invalidGetResponse = await server.request("/users/not-an-id");
    expect(invalidGetResponse.status).toBe(422);

    const invalidDeleteResponse = await server.request("/users/not-an-id", { method: "DELETE" });
    expect(invalidDeleteResponse.status).toBe(422);
  });

  it("returns a not-found response for unknown routes", async () => {
    const response = await server.request("/does-not-exist");

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: "Not Found - /does-not-exist" });
  });
});
