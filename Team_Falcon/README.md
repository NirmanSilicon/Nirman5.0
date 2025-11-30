# CrowdResolve

A production-ready platform for citizens to report local issues and for officials to manage them.

## Tech Stack

-   **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Leaflet
-   **Backend**: Node.js, Express, TypeScript, JWT, PostgreSQL
-   **Database**: PostgreSQL (hosted on Supabase)
-   **Deployment**: Vercel (for both frontend and serverless backend)

## Quick Start

1.  **Install dependencies**
    ```bash
    npm install
    ```
    This will install dependencies for both the frontend and backend.

2.  **Set up Environment Variables**

    -   **Backend**: Copy `packages/backend/.env.example` to `packages/backend/.env` and fill in your values.
        -   `DATABASE_URL`: Your PostgreSQL connection string (from Supabase).
        -   `JWT_SECRET`: A strong, random secret for signing JWTs.
        -   `FRONTEND_URL`: `http://localhost:5173` for development.

    -   **Frontend**: Copy `packages/frontend/.env.example` to `packages/frontend/.env` and fill in your values.
        -   `VITE_API_URL`: `http://localhost:5000` for development.

3.  **Set up the Database**
    -   Get a PostgreSQL database (e.g., from [Supabase](https://supabase.com/)).
    -   Run the SQL script located at `packages/backend/src/db/schema.sql` in your database to create the necessary tables.

4.  **Run the development servers**
    ```bash
    npm run dev
    ```
    This will start both the backend server (on port 5000) and the frontend dev server (on port 5170) concurrently.

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` configuration in the root directory handles routing API requests to the serverless function.

## Demo Credentials

After setting up your database, you can create these users via the `/api/auth/register` endpoint:

-   **Admin User**: Email: `admin@example.com`, Password: `password123`
-   **Gov Official**: Email: `official@example.com`, Password: `password123`
-   **Citizen**: Email: `citizen@example.com`, Password: `password123`