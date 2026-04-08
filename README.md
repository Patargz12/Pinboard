# Map Pin Board

An interactive map-based pinboard application where users can drop, view, and manage location pins on a map with reverse-geocoded addresses.

## Tech Stack

- **React 18** with **TypeScript**
- **React Router v6** – client-side routing
- **Zustand** – lightweight state management
- **react-leaflet** / **Leaflet** – interactive map rendering
- **TailwindCSS** – utility-first styling
- **Zod** – runtime schema validation for pin data
- **OpenStreetMap Nominatim API** – reverse geocoding

## Features

### Core

- Click anywhere on the map to drop a pin
- Reverse geocode pin coordinates to human-readable addresses via Nominatim
- Dynamic list view displaying all pins with coordinates and addresses
- Delete pins from the list — removes them from the map in sync
- Pin detail view with full address breakdown

### Enhanced

- Draggable pins — reposition pins on the map, address auto-updates
- LocalStorage persistence — pins survive page reloads
- Search bar to filter pins by address or label
- Custom pin labels and notes
- Confirmation modal before pin deletion
- Toast notifications for pin actions (added, deleted, updated)
- Mobile-responsive layout with collapsible sidebar
- Animated pin drops and list transitions
- Bulk delete / clear all pins
- Export pins as JSON

## Getting Started

```bash
git clone <repo-url>
cd map-pin-board
npm install
npm run dev
```

## Environment

No API keys required — uses OpenStreetMap's free Nominatim API for reverse geocoding.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Deployment

Deployed via **Vercel** — push to `main` triggers auto-deploy.