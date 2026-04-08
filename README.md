# Map Pinboard

Interactive map-based pinboard application where users can drop, view, and manage location pins with reverse-geocoded addresses.

## Tech Stack

- React 19 + TypeScript
- TanStack Router / React Start
- Zustand
- Leaflet + React Leaflet
- Tailwind CSS v4
- Zod
- OpenStreetMap Nominatim API (reverse geocoding)

## Thought Process

Hi, This is Patrick Arganza, just wanted to share my thought process on how I got it done. The first thing that I did is to study the parts I am unfamiliar with which is geocoding and the usage of mapping libraries.
Upon, researching I discovered that react-leaflet is the easiest and the best library to use in our use cases.

Based on the requirements, I am required to use React JS with TypeScript and that's the time I started working on developing the application as the whole after layouting my MVP from tech stack, libraries and frameworks to be used.

## Requirements

### React with TypeScript

The Application was developed using React with TypeScript and Zod.

### TailwindCSS for styling

It is properly using TailwindCSS v4 along with reusable tailwind classes to properly demonstrate working on design systems

### State Management via useState, Context API or Zustand

I used Zustand since this is the state management library I am very experrienced with

### Mapping Library

The library I chose is react-leaflet because it is very easy to use no need for any sign ups , API Integrations. Therefore, I don't need to think of API token limits for this assessment.

### Reverse Geocoding

I have properly integrated Geocoding using the OpenStreetMap Nominatim API

## Bonus Features

### Draggable Pins

The pins being rendered on the map are all draggable

### Persisting pin data using localStorage

It is using the local storage as well, try to pin and then appropriately check your local storage, you will see "pin-store" inside.

### Mobile Responsive Layout

I have successfully copied both landscape and portrait version of the application based on the video sent.

### Animated Transitions

There are minimalistic animations using framer motion on list changes and tooltip fading rendering

### Deployment via Vercel or Netlify

I have deployed the application on Vercel ( Since I am using Tanstack, the deployment was possible using Nitro)

## Beyond the Baseline

### Containerized Application

Upon seeing the job description, the preffered candidate is someone who has experience in Docker Kubernetes or devops technologies, with my decent knowledge and experience on multi stage docker build. I decided to demonstrate it as well in the assessment

### Modular Approach (Features Folder Structure)

To execute a proper modularity, one of the solution is to use the features folder ( the structure I used on my previous job ). Wherein, I am very familiar with.

### Marker Clustering with React Leaflet

Since I studied and read their documentations I discovered the clustering feature. I added marker clustering so pins merge into count-based clusters at lower zoom levels and expand into individual markers as the user zooms in.

## Getting Started

Use this section when moving the project to a new machine.

### 1. Install Prerequisites

- Git
- Node.js 22 LTS (recommended)
- npm (comes with Node.js)
- Docker Desktop (for containerized run)

### 2. Get the Project Files

**Option A:** Clone from git

```bash
git clone <repo-url>
cd pinboard
```

**Option B:** Copy the folder manually

- Copy the entire project folder (including package-lock.json, Dockerfile, and docker-compose.yml)
- Open a terminal in the copied project root

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally (Development)

```bash
npm run dev
```

App URL: `http://localhost:3000`

## Docker Setup

### 1. Start Docker Desktop

Ensure Docker Desktop is running before using compose commands.

### 2. Build and Run Container

From the project root:

```bash
docker compose up -d --build
```

App URL: `http://localhost:3000`

### 3. Stop Container

```bash
docker compose down
```

### 4. Start Again Without Rebuild

```bash
docker compose up -d
```

### 5. View Logs

```bash
docker compose logs -f
```

## Common Transfer Issues

### Lockfile Out of Sync During Docker Build

If you see npm ci errors about package.json and package-lock.json mismatch:

```bash
npm install
docker compose build --no-cache
docker compose up -d
```

If still failing:

```bash
rm -rf node_modules package-lock.json
npm install
docker compose build --no-cache
docker compose up -d
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server from .output |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |