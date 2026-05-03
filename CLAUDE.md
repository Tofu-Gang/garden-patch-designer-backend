# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What it does

Strapi project providing a REST API for the garden patch designer. Manages two content types: `Member` and `Patch`. The API is accessed without authentication — permissions are granted to the Public role.

## Commands

```bash
npm run develop   # Start in development mode (with admin panel, auto-reload)
npm run build     # Build admin panel
npm run start     # Start in production mode (no auto-reload)
npm run console   # Interactive Strapi console (REPL)
npm run deploy    # Deploy to Strapi Cloud
```

## Stack

- **Strapi v5** — headless CMS framework (Node.js 20–24 required)
- **PostgreSQL** via Neon (cloud-hosted); configured through `DATABASE_URL` in `.env`
- Plugins: `@strapi/plugin-users-permissions`, `@strapi/plugin-cloud`

## Content types

### Member

| Field | Type   | Required |
|-------|--------|----------|
| name  | String | yes      |

Members are created manually via the Strapi admin panel.

### Patch

| Field        | Type     | Required | Notes                    |
|--------------|----------|----------|--------------------------|
| x            | Decimal  | yes      | % of image width (0–100)  |
| y            | Decimal  | yes      | % of image height (0–100) |
| width        | Decimal  | yes      | % of image width         |
| height       | Decimal  | yes      | % of image height        |
| season       | Integer  | yes      | e.g. 2025                |
| planted_at   | Date     | no       |                          |
| harvested_at | Date     | no       |                          |
| description  | Text     | no       |                          |
| member       | Relation | yes      | Many-to-one → Member     |

## Permissions

In the Strapi admin panel, under **Settings → Roles → Public**, enable:

- `find`, `findOne` — for Member
- `find`, `findOne`, `create`, `update`, `delete` — for Patch

## API

Base URL: `http://localhost:1337` (dev) or your deployed Strapi URL (prod).

Key endpoints:
- `GET /api/members`
- `GET /api/patches?populate=member`
- `POST /api/patches`
- `PUT /api/patches/:id`
- `DELETE /api/patches/:id`

## Environment Variables

Copy `.env.example` to `.env`. Key variables:

```
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require
APP_KEYS=<comma-separated-keys>
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
JWT_SECRET=
TRANSFER_TOKEN_SALT=
ENCRYPTION_KEY=
```

## Architecture

### Config (`config/`)
- `server.js` — host (`0.0.0.0`), port (`1337`), `APP_KEYS`
- `admin.js` — JWT/API token/transfer token secrets
- `database.js` — multi-database support; currently PostgreSQL via `DATABASE_URL`
- `api.js` — REST defaults: `limit: 25`, `maxLimit: 100`, `withCount: true`
- `middlewares.js` — full middleware stack (CORS, security, logger, body parser, etc.)

### Content Types (`src/api/`)
Each type lives at `src/api/<type-name>/` with sub-folders: `content-types/`, `controllers/`, `routes/`, `services/`.

### Application Hooks (`src/index.js`)
Exposes `register()` and `bootstrap()` lifecycle hooks for custom startup logic.

### Extensions (`src/extensions/`)
For overriding plugin behavior (e.g., customizing `users-permissions`).