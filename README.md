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
