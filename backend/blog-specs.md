# Blog Website POC - Full-Stack Specification

## Project Overview

Create a Proof of Concept (POC) Blog Website as a **monorepo** with a separate
Express REST API backend and a Next.js frontend in `frontend/`.

**Backend**

- Node.js (Latest LTS)
- Express.js
- MySQL
- Sequelize ORM (Models + Migrations + Seeders)
- JWT authentication + Role-Based Access Control (RBAC)

**Frontend** (`frontend/`)

- Next.js (App Router)
- Tailwind CSS + PrimeReact UI components
- **TanStack React Query** for server-state (API requests, cache, mutations)
- Facebook-inspired social feed layout (navbar, sidebars, post cards, comments)
- Consumes the Express REST API via `NEXT_PUBLIC_API_URL`
- Public site + admin dashboard

The goal is to provide a clean, scalable system that demonstrates:

- User Management
- Authentication & Authorization (3 user roles)
- Blog Post Management
- Comments
- Database Relationships
- Admin Dashboard to manage all data

---

# User Roles & Permissions

The system supports three user types:

- **Guest** — not logged in (no token)
- **User** — authenticated, role = `user`
- **Admin** — authenticated, role = `admin`

## Permission Matrix

| Capability                          | Guest | User | Admin |
| ----------------------------------- | :---: | :--: | :---: |
| View posts & comments               |  Yes  | Yes  |  Yes  |
| Register / Login                    |  Yes  |  -   |   -   |
| Create posts / add comments         |  No   | Yes  |  Yes  |
| Edit / delete **own** post          |  No   | Yes  |  Yes  |
| Edit / delete **own** comment       |  No   | Yes  |  Yes  |
| Edit / delete **any** post          |  No   |  No  |  Yes  |
| Edit / delete **any** comment       |  No   |  No  |  Yes  |
| Manage users (list/role/delete)     |  No   |  No  |  Yes  |
| Access Admin Dashboard (`/admin`)   |  No   |  No  |  Yes  |
| Access own profile (`/profile`)     |  No   | Yes  |  Yes  |
| Upload profile image                |  No   | Yes  |  Yes  |
| Reset own password                  |  No   | Yes  |  Yes  |
| Set post visibility (public/private)|  No   | Yes  |  Yes  |
| View **private** posts              |  No   | Owner only | Owner + Admin |

Roles are enforced on the backend via `authenticate` + `authorize('admin')`
middleware. The frontend mirrors these rules for UX only.

---

# Functional Requirements

## Authentication

### User Registration

Endpoint:

POST /api/auth/register

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "+1 555-0100",
  "address": "123 Main St, City",
  "dateOfBirth": "1990-05-15"
}
```

Validation:

- name required
- email required
- email unique
- password minimum 6 characters
- phone, address, dateOfBirth optional (`dateOfBirth` as ISO date `YYYY-MM-DD`)

Response:

201 Created

{
  "message": "User created successfully"
}

---

### User Login

Endpoint:

POST /api/auth/login

Request:

{
  "email": "john@example.com",
  "password": "123456"
}

Response:

200 OK

{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

The JWT payload includes the user's `role`, used for authorization.

---

## Users

### Get Current User

Endpoint:

GET /api/users/profile

Authentication Required

Response:

{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}

---

# Blog Posts

## Create Post

Endpoint:

POST /api/posts

Authentication Required

Request:

{
  "title": "My First Blog",
  "content": "Blog Content"
}

Validation:

- title required
- content required

Response:

201 Created

{
  "message": "Post created successfully"
}

---

## Get All Posts

Endpoint:

GET /api/posts

Features:

- Pagination
- Search by title
- Returns **public** posts only (`visibility = public`)

Query Parameters:

?page=1
&limit=10
&search=node

Response:

{
  "data": [],
  "pagination": {}
}

---

## Get Single Post

Endpoint:

GET /api/posts/:id

Authentication Optional (token allows owner/admin to view private posts)

Private posts return `403` for guests and non-owners.

Response:

{
  "id": 1,
  "title": "My First Blog",
  "content": "Content",
  "author": {},
  "comments": []
}

---

## Update Post

Endpoint:

PUT /api/posts/:id

Authentication Required

Owner or Admin can update.

Request:

```json
{
  "title": "Updated Title",
  "content": "Updated Content",
  "visibility": "public"
}
```

`visibility` is optional: `public` | `private` (default `public` on create).

Response:

Response:

{
  "message": "Post updated"
}

---

## Delete Post

Endpoint:

DELETE /api/posts/:id

Authentication Required

Owner or Admin can delete.

Response:

{
  "message": "Post deleted"
}

---

# User Profile API

All profile endpoints require Authentication.

## Get Profile

GET /api/users/profile

Response:

```json
{
  "success": true,
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "profileImage": "/uploads/avatars/user-1.jpg",
  "phone": "+1 555-0100",
  "address": "123 Main St, City",
  "dateOfBirth": "1990-05-15"
}
```

## Update Profile

PUT /api/users/profile

Request (all fields optional except at least one should be sent):

```json
{
  "name": "John Updated",
  "phone": "+1 555-0199",
  "address": "456 Oak Ave",
  "dateOfBirth": "1990-05-15"
}
```

`dateOfBirth` may be `null` to clear the value.

## Reset Password

PUT /api/users/password

Request:

```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

Requires valid `currentPassword`. `newPassword` minimum 6 characters.

## Upload Profile Image

POST /api/users/profile/avatar

`multipart/form-data` field: `avatar` (JPEG, PNG, GIF, WebP; max 2 MB)

Stored under `uploads/avatars/` and served at `/uploads/avatars/...`.

## Get My Posts

GET /api/users/me/posts?page=1&limit=10

Returns all posts by the authenticated user (public **and** private), each with nested comments.

---

# Comments

## Create Comment

Endpoint:

POST /api/posts/:id/comments

Authentication Required

Request:

{
  "content": "Great article!"
}

Response:

{
  "success": true,
  "message": "Comment added"
}

---

## Get Post Comments

Endpoint:

GET /api/posts/:id/comments

Response:

[
  {
    "id": 1,
    "content": "Great article",
    "user": {}
  }
]

---

## Update Comment

Endpoint:

PUT /api/comments/:commentId

Authentication Required

Owner or Admin can update.

Request:

{
  "content": "Updated comment text"
}

Response:

{
  "success": true,
  "message": "Comment updated"
}

---

## Delete Comment

Endpoint:

DELETE /api/comments/:commentId

Authentication Required

Owner or Admin can delete.

Response:

{
  "success": true,
  "message": "Comment deleted"
}

---

# Admin API

All admin endpoints require Authentication + role = `admin`.
Protected by `authenticate` + `authorize('admin')`.

## Dashboard Stats

GET /api/admin/stats

Response:

{
  "data": {
    "users": 10,
    "admins": 1,
    "posts": 25,
    "comments": 80
  }
}

## Manage Users

- GET /api/admin/users — list all users
- PATCH /api/admin/users/:id/role — change role (`{ "role": "admin" | "user" }`)
- DELETE /api/admin/users/:id — delete a user

Guards: an admin cannot demote or delete their own account.

## Manage Posts

- GET /api/admin/posts — list all posts (with author)
- DELETE /api/admin/posts/:id — delete any post

## Manage Comments

- GET /api/admin/comments — list all comments (with user + post)
- DELETE /api/admin/comments/:id — delete any comment

---

# Database Design

## Users Table

Fields:

- id
- name
- email
- password
- role (ENUM 'admin' | 'user', default 'user')
- profileImage (nullable — path to avatar file)
- phone (nullable)
- address (nullable — text)
- dateOfBirth (nullable — DATE)
- createdAt
- updatedAt

---

## Posts Table

Fields:

- id
- title
- content
- userId
- visibility (ENUM 'public' | 'private', default 'public')
- createdAt
- updatedAt

---

## Comments Table

Fields:

- id
- content
- userId
- postId
- createdAt
- updatedAt

---

# Relationships

User hasMany Posts

User hasMany Comments

Post belongsTo User

Post hasMany Comments

Comment belongsTo User

Comment belongsTo Post

---

# Non Functional Requirements

## Security

- JWT Authentication (payload includes `role`)
- Password hashing using bcrypt
- Protected routes middleware (`authenticate`)
- Role-Based Access Control middleware (`authorize(...roles)`)
- Ownership checks on posts/comments (owner or admin)

---

## Validation

Use express-validator.

Validate:

- Required fields
- Email format
- Password length

---

## Error Handling

Standard response:

{
  "success": false,
  "message": "Error message"
}

Use centralized error middleware.

---

# Project Structure

The repository is a monorepo: the Express API at the project root and the
Next.js app under `frontend/`.

```
blogs-POC/
├── src/                      # Express REST API (backend only)
│   ├── config/
│   │   ├── database.js
│   │   ├── env.js
│   │   └── config.js         # sequelize-cli config
│   ├── models/
│   │   ├── User.js           # includes role ENUM
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── index.js
│   ├── migrations/           # users, posts, comments, add-role-to-users
│   ├── seeders/              # admin user seeder
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── comment.controller.js
│   │   ├── user.controller.js      # profile, password, avatar, my posts
│   │   └── admin.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── user.routes.js
│   │   ├── comment.routes.js
│   │   └── admin.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js     # authorize(...roles)
│   │   ├── upload.middleware.js   # multer avatar upload
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── post.service.js
│   │   ├── comment.service.js
│   │   ├── user.service.js
│   │   └── admin.service.js
│   ├── uploads/avatars/         # stored profile images (gitignored)
│   ├── utils/
│   │   ├── jwt.js
│   │   └── response.js
│   ├── app.js                # API-only (no static UI)
│   └── server.js
│
└── frontend/                 # Next.js app (App Router + Tailwind + PrimeReact)
    ├── app/
    │   ├── page.js                  # Home feed (Facebook-style)
    │   ├── login/page.js
    │   ├── register/page.js
    │   ├── search/page.js           # Search results + Clear
    │   ├── posts/[id]/page.js       # Post detail + comments
    │   ├── posts/new/page.js        # Create post (with privacy)
    │   ├── profile/page.js          # Profile view, my posts, password
    │   ├── profile/edit/page.js     # Edit name, avatar, phone, address, DOB
    │   └── admin/page.js            # Admin dashboard
    ├── components/
    │   ├── layout/                  # AppShell, TopNav, sidebars
    │   ├── posts/                   # PostCard, PostComposer, VisibilityBadge
    │   ├── comments/                # CommentSection
    │   ├── auth/                    # AuthGuard
    │   └── Providers.js             # QueryClient + PrimeReact + Auth
    ├── hooks/
    │   ├── queries/                 # usePostsQuery, usePostQuery, useProfileQuery, useMyPostsQuery, useAdmin*
    │   └── mutations/               # usePost*, useComment*, useProfile*, useAdmin*, useAuth*
    ├── context/AuthContext.js       # JWT + user session state
    └── lib/
        ├── api.js                   # REST fetch client
        ├── queryClient.js           # QueryClient defaults
        └── queryKeys.js             # Centralized query key factory
```

---

# Environment Variables

## Backend (`.env`)

PORT=5000

DB_HOST=localhost

DB_PORT=3306

DB_NAME=blog_db

DB_USER=root

DB_PASSWORD=root

DB_DIALECT=mysql

JWT_SECRET=your_secret

JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

## Frontend (`frontend/.env.local`)

NEXT_PUBLIC_API_URL=http://localhost:5000/api

> Backend runs on port **5000**. Next.js dev server runs on port **3000**.

---

# Seed Data

A default admin account is seeded via Sequelize seeders:

- Email: `admin@blog.com`
- Password: `admin123`
- Role: `admin`

---

# Sequelize Requirements

Use Sequelize Models, Migrations and Seeders.

Commands:

npx sequelize-cli db:create

npx sequelize-cli db:migrate

npx sequelize-cli db:seed:all

---

# Frontend (Next.js)

## Stack

- Next.js (App Router) + Tailwind CSS + PrimeReact
- **TanStack React Query v5** — server-state management for all API data
- Facebook-inspired UI: top navbar, left/right sidebars, centered feed, rounded cards
- Client-side auth: JWT in `localStorage`, sent as `Authorization: Bearer <token>`
- Auth session via React context (`AuthContext`); API data via React Query

## Data fetching (React Query)

### Architecture

| Layer | Responsibility |
| ----- | -------------- |
| `lib/api.js` | Low-level `fetch` wrapper, error normalization |
| `lib/queryKeys.js` | Hierarchical, typed query-key factory |
| `lib/queryClient.js` | Global defaults (`staleTime`, `gcTime`, retry) |
| `hooks/queries/*` | `useQuery` hooks — read server state |
| `hooks/mutations/*` | `useMutation` hooks — write + cache invalidation |
| Components | Consume hooks; no direct `fetch` / `useEffect` for API data |

### Query keys

```js
queryKeys.posts.infiniteList(limit, search) // infinite scroll feed & search
queryKeys.posts.infiniteMine(limit)         // infinite scroll user's posts
queryKeys.posts.list(page, limit, search)   // legacy page-based (unused)
queryKeys.posts.mine(page, limit)           // legacy page-based (unused)
queryKeys.posts.detail(id)                  // single post
queryKeys.posts.comments(postId)            // post comments
queryKeys.auth.profile                      // user profile
queryKeys.admin.stats()                     // admin dashboard
```

### Best practices applied

- **Separation of concerns** — components never call `api()` directly for CRUD; they use query/mutation hooks
- **Centralized keys** — `queryKeys` prevents typos and enables targeted `invalidateQueries`
- **Automatic cache invalidation** — mutations invalidate related lists/details after create/update/delete
- **`useInfiniteQuery`** — home feed, search, and profile posts load more on scroll (Intersection Observer sentinel)
- **`enabled` guards** — search query only runs when a keyword is present; admin queries require a token
- **`select` transforms** — infinite query hooks flatten pages into a single `posts` array
- **Loading / error states** — `isLoading`, `isFetching`, `isError`, `isPending` drive UI feedback
- **DevTools** — `@tanstack/react-query-devtools` enabled in development

### Hooks reference

**Queries**

- `useInfinitePostsQuery({ limit, search, enabled })` — infinite scroll feed / search (public posts)
- `usePostQuery(id)` — single post detail (sends token for private post access)
- `useCommentsQuery(postId)` — comments for a post
- `useProfileQuery()` — current user profile
- `useInfiniteMyPostsQuery({ limit })` — infinite scroll authenticated user's posts (all visibilities)
- `useAdminStatsQuery`, `useAdminUsersQuery`, `useAdminPostsQuery`, `useAdminCommentsQuery`

**Mutations**

- `useCreatePostMutation`, `useUpdatePostMutation`, `useDeletePostMutation`
- `useCreateCommentMutation`, `useUpdateCommentMutation`, `useDeleteCommentMutation`
- `useUpdateProfileMutation`, `useChangePasswordMutation`, `useUploadAvatarMutation`
- `useDeleteAdminUserMutation`, `useDeleteAdminPostMutation`, `useDeleteAdminCommentMutation`
- `useLoginMutation`, `useRegisterMutation`

## Design (Facebook-style)

- **TopNav** — logo, search bar, home/create/admin shortcuts, profile & logout
- **LeftSidebar** — user card + navigation links
- **RightSidebar** — community info and shortcuts
- **Feed** — post composer (“What’s on your mind?”) + scrollable post cards
- **Post cards** — author avatar (profile image), visibility badge, timestamp, content, comment/read actions
- **Profile page** — hero banner, info cards (phone, address, DOB), password reset, my posts with edit/delete/privacy/comments
- **Edit profile page** (`/profile/edit`) — avatar upload, name, phone, address, date of birth
- **Comments** — bubble-style thread under each post (view/add/edit/delete per RBAC)
- **Auth pages** — split-layout login and register (Facebook-style), register includes optional profile fields

## Pages

Public (Guest):

- `/` — news feed (read posts; composer prompts login)
- `/search?q=...` — search results with always-visible Clear button
- `/login`, `/register`
- `/posts/[id]` — read a post and view comments

Authenticated User:

- `/profile` — profile overview, password reset, my posts feed
- `/profile/edit` — edit name, avatar, phone, address, date of birth
- `/posts/new` — create a post with public/private visibility
- Post composer on home feed (with privacy selector)
- Add / edit / delete own comments on post detail
- Edit / delete own posts from feed, profile, or detail
- Toggle post privacy (public/private) when creating or editing

## Post privacy

| Visibility | Public feed / search | Post detail (guest) | Post detail (owner) |
| ---------- | :------------------: | :-----------------: | :-----------------: |
| `public`   |         Yes          |         Yes         |         Yes         |
| `private`  |         No           |         No          |         Yes         |

Private posts are visible on the owner's `/profile` page and when the owner opens the post directly (with token).

Admin (`/admin`, admin only):

- Dashboard stats (users, admins, posts, comments)
- DataTables to manage users, posts, and comments

## Comments (post detail)

| Action         | Guest | Logged-in user (owner) | Admin        |
| -------------- | :---: | :--------------------: | :----------: |
| View comments  |  Yes  |          Yes           |     Yes      |
| Add comment    |  No   |          Yes           |     Yes      |
| Edit comment   |  No   |    Own comments only   |  Any comment |
| Delete comment |  No   |    Own comments only   |  Any comment |

## Route Protection

- `AuthGuard` redirects guests from protected routes to `/login`
- `/admin` requires `role = admin`
- Comment create / update / delete require authentication (enforced by API)

## Run locally

```bash
# Terminal 1 — backend
npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

---

# Acceptance Criteria

1. User can register.
2. User can login and receive JWT (with role).
3. Authenticated user can create posts.
4. Guests and users can view posts.
5. Users can update/delete only their own posts; admins can manage any post.
6. Guests can view comments; logged-in users can add comments; owners or admins can edit/delete comments.
7. API follows REST standards.
8. Sequelize relationships work correctly.
9. MySQL stores all data.
10. Centralized error handling is implemented.
11. Three roles are supported: guest, user, admin.
12. Role-based access is enforced on the backend (RBAC middleware).
13. A default admin account is available via seeders.
14. A Next.js frontend in `frontend/` consumes the REST API with React Query and a Facebook-style UI.
15. Admin endpoints manage users, posts, and comments via the REST API.
16. Users have a profile page with password reset and own-post management; `/profile/edit` supports avatar, name, phone, address, and date of birth.
17. Registration accepts optional phone, address, and date of birth.
18. Posts support public/private visibility enforced on the backend.