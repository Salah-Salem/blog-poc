# Blog Website POC



A blog platform monorepo with an **Express REST API** backend and a **Next.js** frontend.



## Tech Stack



**Backend** (project root)



- Node.js + Express.js

- MySQL + Sequelize ORM

- JWT auth + RBAC



**Frontend** (`frontend/`)



- Next.js (App Router)

- Tailwind CSS + PrimeReact

- TanStack React Query (server-state / API cache)

- Facebook-inspired social feed UI



## Project Structure



```

src/          # Express REST API

frontend/     # Next.js app

```



## Setup



### Backend



```bash

npm install

cp .env.example .env   # configure MySQL + JWT

npm run db:create

npm run db:migrate

npm run db:seed        # optional admin user

npm run dev            # http://localhost:5000

```



### Frontend



```bash

cd frontend

npm install

cp .env.local.example .env.local

npm run dev            # http://localhost:3000

```



Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` in `frontend/.env.local`.



## API



See endpoint tables in the backend README sections or `blog-specs.md`.



Authenticated requests: `Authorization: Bearer <token>`



Default admin (after seed): `admin@blog.com` / `admin123`

