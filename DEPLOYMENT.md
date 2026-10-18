# TrustLens deployment notes

## Architecture

Deploy the React/Vite frontend to Netlify and the FastAPI + ML backend to a Python host such as Render. Netlify hosts the static frontend; it is not a suitable place to run this project's full PyTorch/Transformers image-analysis pipeline.

## 1. Deploy the backend first

1. Push this project to a Git repository, without `.env`, model caches, uploads, virtual environments, or `node_modules`.
2. Create a Python web service on Render from the repository.
3. Set the service root directory to `backend`.
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add `GROQ_API_KEY` as a secret environment variable in the hosting dashboard. Never commit this key.
7. The Hugging Face detector downloads its model on first use, so allow for a slow cold start and choose a service with enough RAM/disk for PyTorch and the model. A lightweight free instance may not be sufficient or may sleep between requests.
8. Verify `https://YOUR-BACKEND-URL/` returns `{"message":"TrustLens API is running"}`.

## 2. Deploy the frontend to Netlify

1. Create a Netlify site from the same Git repository.
2. Set **Base directory** to `frontend`.
3. Build command: `npm run build`.
4. Publish directory: `dist` (relative to `frontend`). `frontend/netlify.toml` contains these settings and an SPA fallback.
5. In Netlify site environment variables, set `VITE_API_URL` to the deployed backend origin, e.g. `https://your-trustlens-api.onrender.com` (no trailing slash).
6. Trigger a new deploy after setting the environment variable.

## 3. Local development

Frontend, from `frontend/`:

```bash
npm install
# optional: create .env.local with VITE_API_URL=http://localhost:8000
npm run dev
```

Backend, from `backend/`:

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
# Set GROQ_API_KEY in your shell or a local .env file; never commit .env
uvicorn app.main:app --reload --port 8000
```

## Before making the service public

- Restrict CORS to your Netlify domain rather than leaving `*` enabled.
- Add upload size/type validation and safe temporary-file cleanup on the backend.
- Consider rate limiting, request timeouts, and a privacy notice explaining upload processing and retention.
- The frontend accepts JPG, PNG, and WebP; verify the backend detector and image pipeline support all enabled formats before launch.
- The AI probability and trust score are model outputs, not proof. Keep the limitations visible in the UI.
