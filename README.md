# Saarthi

Saarthi turns YouTube videos and topics into something you can actually study from. You search for a video, and alongside the player you get a notebook, an AI chat that has read the transcript, and a code editor — so you can take notes, ask questions about what was just said, and try the code without leaving the page. It also generates learning roadmaps and narrated slide decks from a topic.

## Tech stack

**Frontend** — React 19, Vite, Tailwind, React Router, TipTap (the notebook editor), Monaco (the code editor), React Flow (roadmap graphs)
**Backend** — Node, Express, MongoDB via Mongoose, JWT auth with Google Sign-In
**Transcript service** — Python, Flask, sentence-transformers, Qdrant for vector search
**External APIs** — Google Gemini for generation, Judge0 for code execution, Google Cloud TTS for slide narration, AWS S3 for uploads

## What's in the repo

```
.                  React frontend (Vite)
├── src/
├── backend/       Express API + MongoDB models
└── Services/      Flask service: fetches YouTube transcripts,
                   embeds them, stores them in Qdrant
```

The three parts run as separate processes. The frontend talks only to the backend; the backend calls the Python service when it needs a transcript.

## Running it locally

You need **Node 18+**, **MongoDB** (local or an Atlas connection string), and **Python 3.10+** if you want the video Q&A features.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and set at minimum `DB_URL` and `JWT_SECRET`. Every other value is optional — the server starts without them and only the matching feature is unavailable. Then:

```bash
npm run dev
```

The API comes up on `http://localhost:5000`. Hitting that root URL should return `I'm live!!`.

### 2. Frontend

In a second terminal, from the repo root:

```bash
npm install
cp .env.example .env.development
npm run dev
```

That serves the app on `http://localhost:5173`.

To sign in you need a Google OAuth client ID in both `.env.development` (as `VITE_GOOGLE_CLIENT_ID`) and `backend/.env`. Create one in the [Google Cloud console](https://console.cloud.google.com/apis/credentials) and add `http://localhost:5173` as an authorised JavaScript origin. There's no email/password login, so without this you can see the landing page but can't get any further.

### 3. Transcript service (optional)

Only needed for the AI chat on a video and for generating content from a YouTube URL. Skip it and the rest of the app works.

```bash
cd Services
pip install -r requirements.txt
cp .env.example .env      # add your Qdrant URL and API key
python service.py
```

It listens on port 5001. The first run downloads the `all-MiniLM-L6-v2` embedding model, which is about 90 MB.

## Environment variables

Everything is documented inline in the three `.env.example` files. The short version:

| Variable | Where | Needed for |
| --- | --- | --- |
| `DB_URL` | backend | Everything. The server has nothing to read or write without it. |
| `JWT_SECRET` | backend | Issuing and verifying login tokens. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | backend | Google Sign-In, which is the only way to log in. |
| `VITE_GOOGLE_CLIENT_ID` | frontend | The client half of the same login flow. |
| `VITE_API_BASE_URL` | frontend | Where the app looks for the API. Must end in `/api`. |
| `GEMINI_API_KEY` | backend | Chat, generated notes, roadmaps, slides. Users can also paste their own key in Profile, which takes priority. |
| `RAPIDAPI_KEY` | backend | Running code in the editor (Judge0). |
| `QDRANT_URL` / `QDRANT_API_KEY` | backend + Services | Transcript search behind the video chat. |
| `REDIS_URL` | backend | Caching only. Without it the app recomputes instead, and chat sessions reset on restart. |
| `AWS_*` | backend | File uploads to S3. |
| `ZOHO_EMAIL` / `ZOHO_PASS` | backend | Sending waitlist emails. |

Google Cloud Text-to-Speech needs a service account file at `backend/google_cloud_key.json`. It isn't in the repo — without it, slide narration is the only thing that breaks.

## What you can do in the app

- **`/for-me`** — a video feed built from the interests you pick in your profile, plus your watch history.
- **`/search`** — search YouTube from inside the app.
- **`/video/:id`** — the main screen. Player on one side, and a workspace with three tabs: **Notes** (a rich-text editor that exports to PDF), **Code** (Monaco, running JavaScript, Python, C, C++ or Java through Judge0), and **AI Chat**, which answers using the video's transcript.
- **`/roadmaps`** — generated learning paths, drawn as a graph, with per-subtopic progress tracking.
- **`/creator`** — give it a topic or a YouTube URL and it generates a narrated presentation.
- **`/profile`** — pick interests and add your own Gemini API key.

## Known gaps

Being straight about the state of things:

- `/notes`, `/practice`, `/resources` and `/community` are routed but land on a "coming soon" page.
- In the creator, PDF input and video-lesson output are both visible but disabled.
- PDF export of roadmap notes uses headless Chrome, which needs more memory than
  the free hosting tier allows. It works locally; on the deployed site that one
  endpoint returns a "not available" message instead.
- The frontend builds to a single ~2.9 MB JS chunk. It works, but it needs code splitting.
- The backend has no test suite.

## Deployment

`.github/workflows/deploy.yml` deploys to an EC2 box on push to `main`. It pulls, builds the frontend for nginx to serve, installs backend dependencies and restarts the API under pm2. It expects `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` and `EC2_APP_DIR` to be set as repository secrets.
