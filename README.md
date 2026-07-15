# task-manager-frontend

Frontend for a Kanban style project management tool. Create boards, add columns and task cards, and reorder everything with drag and drop. Talks to an ASP.NET Core backend API.

## Tech stack

- [React Router 7](https://reactrouter.com/) in framework mode with SSR (React 19, TypeScript)
- [Vite 8](https://vite.dev/) with [Tailwind CSS 4](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query) for server state and cache invalidation
- [dnd-kit](https://dndkit.com/) for drag and drop
- [Lucide](https://lucide.dev/) for icons

## Features

- Boards overview with create and delete
- Board page with columns and task cards
- Add, edit and remove tasks via a modal form
- Drag and drop for tasks and columns, powered by dnd-kit sortable
- Server side rendering out of the box via `react-router-serve`

## Getting started

Requirements: Node.js 20+ and a running instance of the task manager backend API.

```bash
npm install
```

Create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:5033
```

Start the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173`.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Production build to `build/` |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Generate route types and run `tsc` |

## Project structure

```
app/
  api/          Fetch wrapper and API modules per resource (boards, columns, tasks)
  components/   UI components (task cards, sortable columns, modal, forms)
  constants/    API base URL
  routes/       Route modules: home (boards overview) and board/:id
  types/        Shared TypeScript types
  views/        Page level views composed from components
```

## API

All data comes from the backend API configured through `VITE_API_URL`. The client (`app/api/client.ts`) is a thin `fetch` wrapper that sets JSON headers, throws on non-2xx responses so TanStack Query picks them up as errors, and handles empty `204 No Content` responses on `PUT` and `DELETE`.

### Developing on WSL with a Windows hosted API

If the backend runs on Windows while the frontend runs inside WSL, the browser cannot reach the API on `localhost` directly. `proxy.mjs` is a transparent TCP proxy that forwards `127.0.0.1:5033` to the Windows host without touching the `Origin` header, so the API's CORS rule keeps matching:

```bash
WIN_IP=<windows-host-ip> node proxy.mjs
```

## Docker

The multi-stage `Dockerfile` builds and serves the production bundle:

```bash
docker build -t task-manager-frontend .
docker run -p 3000:3000 task-manager-frontend
```
