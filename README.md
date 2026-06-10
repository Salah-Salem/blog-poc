# Blog POC

A full-stack blog platform proof of concept built for learning and demonstrating modern Node.js patterns. The project is a **monorepo** with an Express REST API backend and a Next.js frontend — a social-style feed UI with authentication, role-based access, posts, comments, and an admin dashboard.

## Features

- **Authentication** — JWT-based register, login, and password reset
- **Role-based access** — Guest, User, and Admin roles with backend-enforced permissions
- **Posts** — Create, edit, delete posts with public/private visibility
- **Comments** — Threaded discussion on posts with ownership rules
- **User profiles** — Profile fields, avatar upload, and personal post history
- **Admin dashboard** — User management, content moderation, and platform stats
- **Social feed UI** — Facebook-inspired layout with navbar, sidebars, and post cards

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Node.js, Express, MySQL, Sequelize ORM, JWT, bcrypt, Multer |
| **Frontend** | Next.js (App Router), React 19, Tailwind CSS, PrimeReact, TanStack React Query |
| **Database** | MySQL with migrations and seeders |

## Project Structure

```
blog-poc/
├── backend/          # Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── blog-specs.md # Full API & requirements spec
│   └── README.md
├── frontend/         # Next.js app
│   ├── app/          # App Router pages
│   ├── components/
│   ├── hooks/        # React Query hooks
│   └── README.md
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [MySQL](https://www.mysql.com/) 8.x running locally
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd blog-poc
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MySQL credentials and a secure `JWT_SECRET`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blog_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Create the database, run migrations, and optionally seed an admin user:

```bash
npm run db:create
npm run db:migrate
npm run db:seed
npm run dev
```

The API runs at **http://localhost:5000**. Health check: `GET /health`.

### 3. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Set the API URL in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

The app runs at **http://localhost:3000**.

## Default Admin Account

After running the database seeder:

| Field | Value |
|-------|-------|
| Email | `admin@blog.com` |
| Password | `admin123` |

Use this account to access the admin dashboard at `/admin`.

## API Overview

All API routes are prefixed with `/api`. Authenticated requests require:

```
Authorization: Bearer <token>
```

| Route group | Base path | Description |
|-------------|-----------|-------------|
| Auth | `/api/auth` | Register, login |
| Users | `/api/users` | Profile, password, avatar, own posts |
| Posts | `/api/posts` | CRUD, visibility, nested comments |
| Comments | `/api/comments` | Update and delete comments |
| Admin | `/api/admin` | Stats, user/post/comment management |

For full endpoint documentation, request/response schemas, and the permission matrix, see [backend/blog-specs.md](backend/blog-specs.md).

## User Roles

| Capability | Guest | User | Admin |
|------------|:-----:|:----:|:-----:|
| View public posts & comments | ✓ | ✓ | ✓ |
| Register / login | ✓ | — | — |
| Create posts & comments | — | ✓ | ✓ |
| Edit/delete own content | — | ✓ | ✓ |
| Edit/delete any content | — | — | ✓ |
| Manage users & access admin | — | — | ✓ |
| Set post visibility | — | ✓ | ✓ |
| View private posts | — | Owner only | Owner + Admin |

## Scripts

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API (production) |
| `npm run db:create` | Create MySQL database |
| `npm run db:migrate` | Run Sequelize migrations |
| `npm run db:seed` | Seed admin user |

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Documentation

- [Backend README](backend/README.md) — API setup and configuration
- [Frontend README](frontend/README.md) — UI setup and React Query data layer
- [Full specification](backend/blog-specs.md) — Requirements, endpoints, and data models

## License

MIT
