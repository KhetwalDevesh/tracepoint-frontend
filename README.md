# Tracepoint Frontend

Incident management dashboard — built with **React**, **Vite**, **TanStack Router/Query/Table**, and **Tailwind CSS**.

## Setup & Run

### Prerequisites

- [Bun](https://bun.sh/) v1.x
- Tracepoint backend running on `http://localhost:4000`

### Local Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:4000`, so the backend must be running.

### Build for Production

```bash
bun run build   # outputs to dist/
bun run preview # preview production build locally
```

### Available Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start Vite dev server with HMR |
| `bun run build` | Typecheck + production build |
| `bun run preview` | Serve production build locally |
| `bun run lint` | Lint with ESLint |

---

## Application Overview

### Pages

| Route | Description |
|---|---|
| `/incidents` | Dashboard — paginated data table with filtering, sorting, and search |
| `/incidents/create` | Create a new incident via form |
| `/incidents/:id` | View incident details with inline edit form |

### Features

- **Server-side data table** — Pagination, multi-column sorting, and filtering all handled by the backend API
- **Real-time search** — Debounced text search across incident title and summary (300ms delay)
- **Multi-value filters** — Filter by multiple severities (badge toggles) and statuses (dropdown) simultaneously
- **Service filter** — Dropdown to filter by service name
- **URL-persisted filters** — All filters, sorting, and pagination are stored in URL search params — survives refresh, supports browser back/forward, and enables shareable filtered views
- **Sortable columns** — Click column headers to cycle through ascending → descending → clear
- **Row navigation** — Click any row to navigate to the incident detail page
- **Create/Edit forms** — Validated with Zod + react-hook-form, with toast notifications on success/error
- **Responsive layout** — Clean header with navigation and "New Incident" button

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 19 | UI components |
| Bundler | Vite 7 | Dev server, HMR, production builds |
| Routing | TanStack Router | File-based type-safe routing |
| Server state | TanStack Query | Data fetching, caching, invalidation |
| Table | TanStack Table | Headless table with manual pagination/sorting |
| URL state | nuqs | Type-safe search params state management |
| Forms | react-hook-form + Zod | Form state and validation |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Components | shadcn/ui pattern | Composable, unstyled UI primitives |
| Icons | Lucide React | Consistent icon set |
| Notifications | Sonner | Toast notifications |
| Linting | Biome + ESLint | Code quality |
| Commit lint | commitlint + Husky | Conventional commit enforcement |

### Project Structure

```
src/
├── components/
│   ├── data-table/          # Table components (adapted from data-table-filters)
│   │   ├── columns.tsx      # Column definitions with badges
│   │   ├── data-table.tsx   # Core table with TanStack Table
│   │   ├── data-table-column-header.tsx   # Sortable headers
│   │   ├── data-table-pagination.tsx      # Page controls
│   │   ├── data-table-skeleton.tsx        # Loading state
│   │   └── data-table-toolbar.tsx         # Search + filters
│   ├── layout/
│   │   └── header.tsx       # App header with navigation
│   ├── ui/                  # Base UI components (shadcn/ui pattern)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   └── textarea.tsx
│   └── incident-form.tsx    # Shared create/edit form
├── hooks/
│   ├── use-incidents.ts     # TanStack Query hooks (CRUD)
│   └── use-debounce.ts      # Debounce hook for search
├── lib/
│   ├── api.ts               # Fetch-based API client
│   ├── constants.ts         # Enum values, color maps
│   └── utils.ts             # cn() utility
├── routes/
│   ├── __root.tsx            # Root layout
│   ├── index.tsx             # Redirect / → /incidents
│   └── incidents/
│       ├── index.tsx         # Incident list page
│       ├── create.tsx        # Create incident page
│       └── $incidentId.tsx   # Detail/edit page
├── schemas/
│   └── incident.ts          # Zod validation schemas
├── types/
│   └── incident.ts          # TypeScript interfaces
└── main.tsx                  # App entry point
```

---

## Commit Convention

Commit messages are enforced by [commitlint](https://commitlint.js.org/) with the **Conventional Commits** preset (`@commitlint/config-conventional`). A [Husky](https://typicode.github.io/husky/) `commit-msg` hook runs automatically on every commit.

Format: `type(scope?): description`

Examples:

```
feat: add incident list page with data table
fix: debounce search input
chore: configure vite proxy
docs: update README
```

---

## Design Decisions & Tradeoffs

### TanStack Router (File-Based Routing)

Routes are defined as files in `src/routes/`, and TanStack Router auto-generates a type-safe route tree. This provides compile-time route validation — linking to a non-existent route is a TypeScript error. The tradeoff is a generated `routeTree.gen.ts` file that must be committed or regenerated.

### Server-Side Table Operations

All pagination, filtering, and sorting are delegated to the backend API. TanStack Table is configured with `manualPagination`, `manualSorting`, and `manualFiltering`. This scales to large datasets (only 10 rows fetched per page) but adds a network round-trip on every interaction. For the ~200 incident dataset, client-side operations would be faster, but server-side is the correct architectural choice for production scale.

### nuqs for URL Search Params

Filter state (search, service, severity, status, sort, pagination) is managed by [nuqs](https://nuqs.dev/) — a type-safe search params state manager for React. It provides built-in parsers (`parseAsInteger`, `parseAsArrayOf`, `parseAsStringLiteral`, etc.) with `.withDefault()` so default values never pollute the URL. Setting a value to `null` removes it from the URL, keeping `/incidents` clean. Filters survive page refresh, browser back/forward works naturally, and filtered views are shareable (e.g. `/incidents?severity=SEV1&severity=SEV2&status=OPEN`).

### TanStack Query for Server State

API data is managed through TanStack Query with a 30-second stale time and automatic cache invalidation after mutations. Creating or updating an incident invalidates the list query, ensuring the table always reflects the latest data. The tradeoff is an additional abstraction over raw `fetch`.

### shadcn/ui Pattern (Not CLI)

UI components follow shadcn/ui conventions (composable, Radix-based, Tailwind-styled) but are manually created rather than installed via the shadcn CLI. This gives full control over component code and avoids CLI dependencies. The tradeoff is more initial setup and no automatic component updates.

### Data-Table-Filters Adaptation

The data table UI is adapted from [openstatusHQ/data-table-filters](https://github.com/openstatusHQ/data-table-filters) patterns — separated into composable components (toolbar, column header, pagination, skeleton). Severity uses badge toggles for quick multi-select, while status and service use dropdowns. This provides a polished filtering UX without a heavy component library.

### Zod v4 for Form Validation

Forms use Zod v4 schemas with `@hookform/resolvers` for declarative validation. Schema definitions are shared between create and edit forms. The tradeoff is Zod v4 is newer and has a different import path (`zod/v4`).

### Vite Proxy for API Requests

The Vite dev server proxies `/api` to `localhost:4000`, avoiding CORS issues during development and mimicking a production reverse-proxy setup. In production, a reverse proxy (nginx, Caddy) would handle this.

---

## Improvements With More Time

- **Advanced data-table-filters** — Faceted filters with counts (e.g. "SEV1 (12)"), date range filter for `createdAt`
- **Dark mode** — Tailwind CSS v4 supports `dark:` variants; add a theme toggle
- **Error boundaries** — Graceful error UI per-route instead of full-page crashes
- **E2E tests** — Playwright tests for critical flows (create, filter, sort, edit)
- **Component tests** — Vitest + Testing Library for individual components
- **Bulk actions** — Select multiple incidents and batch-update status
- **Export** — CSV/JSON export of filtered incident data
- **Real-time updates** — WebSocket connection to auto-refresh table when incidents change
