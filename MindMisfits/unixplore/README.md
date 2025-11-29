# UniXplore

A production-ready, full-stack platform for discovering colleges and their clubs. Built with Next.js, TypeScript, PostgreSQL, and modern web standards.

## Features

- **Public Access**: Browse colleges and clubs without login
- **Admin Authentication**: Secure JWT-based authentication for college and club admins
- **College Management**: Register colleges, manage clubs, approve registrations
- **Club Management**: Post announcements, manage registrations, update information
- **SEO Optimized**: Comprehensive metadata, Open Graph tags, semantic HTML
- **Fully Accessible**: WCAG 2.2 AA compliant with ARIA labels
- **Responsive Design**: Mobile-first, desktop-perfect UI
- **Multilingual Ready**: i18n support for English and Hindi
- **GDPR Compliant**: Cookie-less, privacy-focused
- **Secure**: Password hashing, JWT tokens, SQL injection protection

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, PostgreSQL
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **Database**: PostgreSQL with connection pooling

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

## Installation

1. **Clone the repository**
   ```bash
   cd unixplore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/unixplore
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Set up the database**
   
   Create a PostgreSQL database:
   ```bash
   createdb unixplore
   ```
   
   Run the schema:
   ```bash
   psql -d unixplore -f src/lib/db/schema.sql
   ```
   
   Seed with sample data (includes SOA/ITER college and clubs):
   ```bash
   psql -d unixplore -f src/lib/db/seed.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## Sample Credentials

After seeding the database, you can login with:

**College Admin (SOA University)**
- Email: `admin@soa.ac.in`
- Password: `Admin@123`
- College ID: `CLG-100001`

**Club Admins**
- Email: Any club email from seed data (e.g., `gdg@iter.ac.in`)
- Password: `Club@123`

## Project Structure

```
unixplore/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin dashboards
│   │   ├── colleges/          # College pages
│   │   ├── clubs/             # Club pages
│   │   ├── register/          # Registration pages
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── cards/            # Card components
│   │   └── search/           # Search components
│   └── lib/                   # Utilities and libraries
│       ├── db/               # Database utilities
│       ├── auth.ts           # Authentication
│       ├── validations.ts    # Zod schemas
│       └── utils.ts          # Helper functions
├── public/                    # Static assets
└── package.json
```

## API Routes

### Public
- `GET /api/colleges` - List all colleges
- `GET /api/colleges/[id]` - Get college details
- `GET /api/clubs/[id]` - Get club details
- `GET /api/categories` - List categories

### Authentication
- `POST /api/auth/college/register` - Register college
- `POST /api/auth/college/login` - College admin login
- `POST /api/auth/club/register` - Register club
- `POST /api/auth/club/login` - Club admin login

## Database Schema

- **colleges** - College information
- **college_admins** - College admin accounts
- **clubs** - Club information
- **club_admins** - Club admin accounts
- **categories** - Predefined club categories
- **announcements** - Club announcements
- **registrations** - Club registration links
- **analytics** - Page view tracking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Hosting

Use a managed PostgreSQL service:
- **Neon** (recommended for serverless)
- **Supabase**
- **Railway**
- **AWS RDS**

Update `DATABASE_URL` in your environment variables.

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for authentication
- SQL injection protection (parameterized queries)
- XSS protection
- Security headers (Helmet)
- HTTPS only in production

## License

MIT

## Support

For questions or issues, visit the [Contact page](/contact) or email support@unixplore.com.
