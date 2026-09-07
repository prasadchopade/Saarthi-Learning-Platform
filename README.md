# Saarthi

An AI-assisted learning platform. You find a YouTube lecture, and alongside the player you get a notebook, a code editor, and a chat that can answer questions about what you're watching. It also generates learning roadmaps and slide decks from a topic.

**Live demo:** https://saarthi-learning-platform.vercel.app

> Sign in with Google — there's no password login. The API runs on a free tier that sleeps when idle, so the first request after a quiet spell takes up to a minute to wake up.

## What you can do

**Study a video** (`/video/:id`) — the main screen. Video on one side, and a workspace with three tabs: a rich-text notebook that exports to PDF, a Monaco editor that runs JavaScript, Python, C, C++ and Java, and an AI chat.

**Follow a roadmap** (`/roadmaps`) — 26 generated learning paths across technology, business, design and science, drawn as an interactive graph with per-subtopic progress tracking.

**Generate a deck** (`/creator`) — give it a topic or a YouTube URL and it produces a slide presentation.

**Get recommendations** (`/for-me`) — a video feed built from the interests you pick and what you've already watched.

**Keep notes** (`/notes`) — every notebook you've saved, in one place, with the same editor the video workspace uses.

Plus in-app YouTube search and a profile page where you can supply your own Gemini key.

## Built with

**Frontend** — React 19, Vite, Tailwind, React Router. TipTap for the notebook, Monaco for the editor, React Flow for the roadmap graphs.

**Backend** — Node, Express, MongoDB via Mongoose, Google Sign-In with JWT.

**External** — Gemini for generation, Judge0 for running code.

## Layout

```
.                  React frontend (Vite)
├── src/
└── backend/       Express API and MongoDB models
```

The frontend only ever talks to the API. Video transcripts are fetched in-process
and handed to Gemini directly, so there is no separate service to run.

## Running it locally

You need **Node 20+** and **MongoDB**, either local or a free Atlas cluster.

**API:**

```bash
cd backend
npm install
cp .env.example .env     # set DB_URL and JWT_SECRET
npm run dev
```

Comes up on `http://localhost:5000` — that root URL returns `I'm live!!`.

**Frontend**, in a second terminal from the repo root:

```bash
npm install
cp .env.example .env.development
npm run dev
```

Serves `http://localhost:5173`.

To sign in, create an OAuth client in the [Google Cloud console](https://console.cloud.google.com/apis/credentials), add `http://localhost:5173` as an authorised JavaScript origin, and put the client ID in both `.env.development` and `backend/.env`. Set `GOOGLE_REDIRECT_URL` to the literal string `postmessage` — sign-in runs in a popup, and Google requires popup-issued codes to be exchanged against that value rather than a URL.

## Configuration

Every variable is documented inline in the `.env.example` files. The ones that matter:

| Variable | Needed for |
| --- | --- |
| `DB_URL` | Everything — the API has nothing to read or write without it |
| `JWT_SECRET` | Signing login tokens |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Sign-In, the only way in |
| `VITE_GOOGLE_CLIENT_ID` | The browser half of the same flow |
| `VITE_API_BASE_URL` | Where the frontend looks for the API. Must end in `/api` |
| `GEMINI_API_KEY` | Chat, generated notes, roadmaps and slides. Users can supply their own key in Profile, which takes priority |

The rest are optional and only disable the matching feature. Two worth calling out:

- **The code editor needs no key.** Without `RAPIDAPI_KEY` it falls back to Judge0's free public instance.
- **`REQUIRE_WAITLIST`** gates sign-in behind an approved waitlist entry. It defaults to on, which is how the private beta ran; the public demo sets it to `false`.

## Seeding

A fresh database has no content, so the interests picker and roadmap list start empty.

```bash
cd backend
npm run generate-roadmaps:all
```

That generates the roadmaps through Gemini. Disciplines are seeded separately by calling `POST /api/videos/init` while signed in.

`npm run reset-db` **drops the whole database** before reseeding — it is not an "add sample data" command.

## Deployment

Frontend on Vercel, API on Render, both deploying automatically on push to `main`. `render.yaml` describes the API service; its environment variables live in the Render dashboard rather than the repo. `.github/workflows/ci.yml` builds the frontend and checks the backend on every push.

## Known gaps

- **PDF export of roadmap notes** renders through headless Chrome, which needs more memory than the free tier allows. Works locally; the deployed endpoint reports itself unavailable instead.
- **Slide narration** needs a Google Cloud service account with billing enabled, so it's off on the demo.
- **Video lessons** and **PDF input** show up in the creator but are disabled — there's no backend for them yet.
- `/resources` and `/community` are routed but land on a placeholder.
- The frontend builds to a single ~2.9 MB chunk. It works, but it wants code splitting.
- There are no tests.
