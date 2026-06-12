ATTENDANCESIPP

Full-stack event attendance login/logout system built with Vite, React,
Tailwind CSS, Express, and MongoDB.

## Project Structure

```text
client/   Vite + React frontend
server/   Express + Mongoose backend
```

## Setup

1. Install frontend dependencies:

```bash
cd client
npm install
```

2. Install backend dependencies:

```bash
cd ../server
npm install
```

3. Create `server/.env` from `server/env.example` and set `MONGODB_URI`.

4. Start the backend:

```bash
cd server
npm run dev
```

5. Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The app runs at `http://localhost:5173` and the API runs at
`http://localhost:5000`.

## API

- `POST /api/check` checks whether a student ID exists.
- `POST /api/register` registers a participant.
- `POST /api/login` records a login attendance event.
- `POST /api/logout` records a logout attendance event.

Student IDs must match `YYYY-NNNNN`, for example `2023-12345`.
