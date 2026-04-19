# Helplytics AI — Community Support Platform

A full-stack MERN application connecting people who need help with those who can help. Includes JWT auth, AI-driven request suggestions, trust scoring, leaderboard, notifications, messaging, and a modern dashboard UI.

## Features

- Signup / Login with role selection: `NEED_HELP`, `CAN_HELP`, `BOTH`
- Protected backend routes with JWT
- Help request creation, exploration, detail view, apply, and completion
- AI-driven auto-categorization, urgency detection, tag suggestions, text rewrite, and summary
- User profile, leaderboard, notifications, messaging, and AI center screens
- Clean React + Tailwind UI with reusable components and page structure

## Project Structure

- `backend/` — Express server, Mongoose models, controllers, routes, middleware
- `frontend/` — Vite + React app with pages, components, services, and context

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB connection and JWT secret
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Deployment

This project is structured as a monorepo with separate frontend and backend folders.

### Frontend on Vercel

1. Create a GitHub repository and push the project.
2. In Vercel, import the repo and set the project root to `/frontend`.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Add the environment variable:
   - `VITE_API_URL=https://<your-render-service>.onrender.com/api`
5. Deploy.

### Backend on Render

1. Create a new Web Service in Render and connect the same GitHub repo.
2. Set the root directory to `/backend`.
3. Set the build command to `npm install` and the start command to `npm start`.
4. Add environment variables:
   - `MONGO_URI` (your MongoDB URI)
   - `JWT_SECRET` (your JWT secret)
   - `CLIENT_URL=https://<your-vercel-domain>`
5. Deploy.

### Notes

- Use `frontend/.env.example` as a template for local frontend env variables.
- The frontend now reads `VITE_API_URL` from Vite env, so it can target the Render backend after deployment.

## Backend API Endpoints

- `POST /api/auth/register` — register new user
- `POST /api/auth/login` — login
- `GET /api/users/profile` — fetch profile
- `PUT /api/users/update` — update profile
- `GET /api/users/leaderboard` — leaderboard data
- `POST /api/requests` — create request
- `GET /api/requests` — fetch requests
- `GET /api/requests/:id` — fetch request details
- `PUT /api/requests/:id` — update request
- `DELETE /api/requests/:id` — delete request
- `POST /api/requests/:id/apply` — apply to help
- `POST /api/requests/:id/complete` — mark as completed
- `POST /api/ai/onboarding` — onboarding AI suggestions
- `POST /api/ai/request` — request AI suggestions
- `POST /api/messages` — send message
- `GET /api/messages/:userId` — get conversation
- `GET /api/notifications` — fetch notifications
- `PUT /api/notifications/:id/read` — mark notification read

## Notes

- Ensure MongoDB is running locally or point `MONGO_URI` to your cloud cluster.
- The AI features are powered by in-app heuristics and work without external API keys.
- Use the onboarding page to complete profile details and unlock personalized suggestions.
