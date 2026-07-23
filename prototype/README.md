# LearnMap Prototype

Clickable MVP prototype for LearnMap, built with **Vite + React + TypeScript**, **Tailwind CSS**, and **[shadcn/ui](https://ui.shadcn.com/)**. State is mocked in-memory and persisted to `localStorage` — no backend required.

> Intended as the sibling app repo `learnmap-cursor/prototype`. It lives under `specs/prototype/` until a dedicated repository can be created.

## Run locally

```bash
cd prototype
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Clickable flows

1. **Login** (`/login`) — mock Google / GitHub OAuth  
2. **Onboarding** (`/onboarding`) — display name + avatar confirm  
3. **Dashboard** (`/dashboard`) — enrolled roadmaps, summary strip, recently completed, reset progress  
4. **Browse** (`/browse`) — search (300ms debounce), tag filters (OR), enrol / unenrol  
5. **Viewer** (`/roadmaps/:id`) — React Flow diagram, minimap, topic sheet, status updates  
6. **404** — unknown routes inside the app shell  

Theme: teal/emerald primary tokens + Geist, with light/dark toggle in the avatar menu (or press `d`).

## Stack notes

Matches [`architecture/frontend.md`](../architecture/frontend.md) for the MVP surface (auth shell, catalog, dashboard, viewer). Custom roadmap builder (EP-005) is intentionally out of scope.
