# Template Contact App

A simple full‑stack example app for collecting and managing contact requests.

- Frontend: React, React Router, Tanstack Query, Tailwind
- Backend: Node.js, Express, Kysely
- Database: Postgres via Prisma schema (Kysely types generated with prisma‑kysely)

## Quick start with Docker

Prerequisites:

- Docker Desktop or Docker Engine

Clone the repo:

```zsh
git clone https://github.com/cjvrd/project-template.git
```

Open the repo folder:

```zsh
cd project-template
```

Build the docker containers:

```zsh
docker compose up --build
```

For development with auto-reload on file changes:

```zsh
docker compose watch
```

Then open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Postgres: localhost:5432 (user: postgres, password: postgres, db: postgres)

## API

Base URL: `http://localhost:3000`

- GET `/contacts` — list all contacts
- POST `/contacts` — create a new contact
- DELETE `/contacts/:id` — soft delete contact (status=DELETED)
- PATCH `/contacts/:id` — verify contact (verified=true)
