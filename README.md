# Blueprint Hono

Blueprint Hono is a TypeScript REST API starter built with [Hono](https://hono.dev/). It includes request validation, structured request logging, PostgreSQL persistence through Neon and Drizzle ORM, and OpenAPI documentation.

## Features

- `GET /` returns a service message.
- `GET /healthz` returns `{ "message": "OK" }`.
- `/users` provides create and list operations; `/users/{id}` provides read, update, and delete operations.
- Request schemas are validated, and the endpoints are described in the OpenAPI document.
- Every request receives a request ID and is logged with its method, path, status, and latency.

## Requirements

- Node.js
- pnpm
- A PostgreSQL database accessible through a Neon-compatible connection URL

## Getting started

Install the dependencies and create a local environment file:

```sh
pnpm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to your database connection URL. Then apply the database migrations and start the development server:

```sh
pnpm migrate
pnpm dev
```

The server listens on `http://localhost:8080` by default. Set `PORT` in `.env` to use a different port.

## API

| Method   | Path          | Description               |
| -------- | ------------- | ------------------------- |
| `GET`    | `/`           | Service message           |
| `GET`    | `/healthz`    | Health check              |
| `GET`    | `/users`      | List users                |
| `POST`   | `/users`      | Create a user             |
| `GET`    | `/users/{id}` | Get a user                |
| `PATCH`  | `/users/{id}` | Update a user             |
| `DELETE` | `/users/{id}` | Delete a user             |
| `GET`    | `/docs`       | OpenAPI 3.0 document      |
| `GET`    | `/reference`  | Interactive API reference |

User IDs are integers. Creating a user requires a non-empty `name` and a valid `email`; the email is normalized to lowercase. `PATCH` accepts either field. Successful creation and updates return the user with HTTP 200, deletion returns HTTP 204, missing users return HTTP 404, and invalid input returns HTTP 422.

Example request:

```sh
curl -X POST http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com"}'
```

## Development commands

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `pnpm dev`       | Run the server in watch mode                  |
| `pnpm build`     | Type-check and compile the TypeScript project |
| `pnpm start`     | Start the compiled server                     |
| `pnpm test`      | Run the Vitest test suite                     |
| `pnpm lint`      | Lint the project                              |
| `pnpm fmt`       | Format the project                            |
| `pnpm fmt:check` | Check formatting without changing files       |
| `pnpm generate`  | Generate Drizzle migrations from the schema   |
| `pnpm migrate`   | Apply pending database migrations             |
| `pnpm studio`    | Open Drizzle Studio                           |

The application requires `DATABASE_URL`. In development, environment variables are loaded from `.env`; when `NODE_ENV=test`, they are loaded from `.env.test`. The test suite therefore needs a reachable test database configured in `.env.test`.
