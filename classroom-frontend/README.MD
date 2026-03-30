# Classroom Management System

A full-stack classroom management dashboard built with **Refine.dev** (React frontend), **Node.js/Express** (API backend), **Drizzle ORM** with **Neon PostgreSQL**, **Better Auth** for authentication, and **Shadcn/UI** components.

## ✨ Features
- User authentication & authorization (Better Auth)
- CRUD operations for Classes, Departments, Faculty, Subjects, Enrollments, Users (Teachers/Students)
- Dashboard with stats
- File uploads (Cloudinary)
- Responsive design with Tailwind CSS v4 & Shadcn/UI
- Advanced data tables with Tanstack React Table
- Security: Arcjet, Helmet, CORS
- Monitoring: apminsight
- Serverless DB ready (Neon)

## 🛠 Tech Stack

### Backend (`classroom-backend/`)
| Category | Technologies |
|----------|--------------|
| Runtime | Node.js, Express 5 |
| Database | PostgreSQL (Neon serverless), Drizzle ORM 0.45 |
| Auth | Better Auth 1.5 w/ Drizzle adapter |
| Security | Arcjet 1.1, Helmet 8.1 |
| Monitoring | apminsight 5.3 |
| Utils | Cloudinary, dotenv, CORS |

### Frontend (`classroom-frontend/`)
| Category | Technologies |
|----------|--------------|
| Framework | React 19, Refine.dev 5, React Router 7 |
| UI | Tailwind CSS 4, Shadcn/UI (full component lib), Lucide icons |
| Forms | React Hook Form 7, Zod |
| Data Table | Tanstack React Table 8 |
| Charts | Recharts |
| State | Refine providers |
| Utils | clsx, Tailwind Merge, date-fns, dayjs |

## 📁 Project Structure

```
DashBoard_Project/
├── classroom-backend/                 # Node.js/Express API
│   ├── package.json                   # Dependencies & scripts
│   ├── tsconfig.json                  # TypeScript config
│   ├── drizzle.config.js              # Drizzle migrations
│   ├── src/
│   │   ├── index.ts                   # Server entrypoint
│   │   ├── express.d.ts               # Express types
│   │   ├── type.d.ts                  # Custom types
│   │   ├── config/arcjet.ts           # Arcjet security config
│   │   ├── db/
│   │   │   ├── index.ts               # DB connection
│   │   │   └── schema/                # Drizzle schemas
│   │   │       ├── index.ts
│   │   │       ├── app.ts             # App entities (?)
│   │   │       └── auth.ts            # Auth tables
│   │   ├── lib/
│   │   │   ├── auth.ts                # Auth utils
│   │   │   └── cloudinary.ts          # Cloudinary config
│   │   ├── middleware/security.ts     # Security middleware
│   │   └── routes/                    # API endpoints
│   │       ├── classes.ts
│   │       ├── departments.ts
│   │       ├── enrollments.ts
│   │       ├── stats.ts
│   │       ├── subjects.ts
│   │       └── users.ts
│   ├── drizzle/                       # Generated migrations
│   └── apminsightdata/                # Monitoring logs/data
└── classroom-frontend/                # Refine React app
    ├── package.json                   # Refine/Vite deps & scripts
    ├── tsconfig.json
    ├── vite.config.ts                 # Vite config
    ├── components.json                 # Shadcn config
    ├── src/
    │   ├── App.tsx                     # Main app
    │   ├── index.tsx                   # Entry
    │   ├── providers/                  # Refine providers
    │   │   ├── auth.ts
    │   │   └── data.ts
    │   ├── lib/                        # Utils
    │   │   ├── auth-client.ts
    │   │   ├── cloudinary.ts
    │   │   ├── schema.ts (Zod)
    │   │   └── utils.ts (cn helper)
    │   ├── components/
    │   │   ├── ui/                     # Shadcn/UI components (~40)
    │   │   │   ├── button.tsx
    │   │   │   ├── table.tsx
    │   │   │   ├── data-table.tsx      # Custom Refine table
    │   │   │   └── ... (accordion, dialog, etc.)
    │   │   ├── refine-ui/              # Refine-specific
    │   │   │   ├── data-table/         # Advanced tables w/ pagination/sort/filter
    │   │   │   ├── buttons/            # CRUD buttons
    │   │   │   ├── layout/             # Header, Sidebar, Breadcrumb
    │   │   │   └── form/               # Auth forms
    │   │   └── upload-widget.tsx       # Cloudinary
    │   ├── pages/                      # Refine resource pages
    │   │   ├── dashboard.tsx
    │   │   ├── classes/ (create, list, show)
    │   │   ├── departments/ (create, list, show)
    │   │   ├── subjects/ (create, list, show)
    │   │   ├── faculty/ (list, show)
    │   │   ├── enrollments/ (create, join, confirm)
    │   │   └── auth/ (login, register - index/custom)
    │   ├── hooks/use-mobile.ts
    │   ├── constants/index.ts
    │   └── types/index.ts
    └── public/favicon.ico
```

**Notes:**
- apminsightdata/: Auto-generated monitoring (ignore in .gitignore)
- drizzle/: DB migrations (auto-generated)

## 🧩 Database Schema
Defined in `classroom-backend/src/db/schema/`. Likely tables:
- Users (students, teachers, admins) via Better Auth
- Classes, Subjects, Departments, Faculty
- Enrollments (student-class relations)
Run `npm run db:generate` to see migrations.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL/Neon account
- Cloudinary account (uploads)
- `.env` files (see below)

### 1. Backend Setup
```bash
cd classroom-backend
cp .env.example .env  # Create if missing
# Edit .env: DATABASE_URL, AUTH_SECRET, CLOUDINARY_*, ARCJET_*
npm install
npm run db:generate
npm run db:migrate
npm run dev  # http://localhost:8000
```

### 2. Frontend Setup
```bash
cd classroom-frontend
cp .env.example .env  # Create if missing
# Edit .env: VITE_API_URL=http://localhost:8000, AUTH_*
npm install
npm run dev  # http://localhost:5173
```

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://... (Neon)
AUTH_SECRET=your-secret
AUTH_URL=http://localhost:8000/auth
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ARCJET_KEY=...
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
VITE_AUTH_CALLBACK_URL=http://localhost:5173/auth/success
```

## 📦 Scripts & Commands

### Backend
| Script | Description |
|--------|-------------|
| `npm run dev` | TSX watch mode |
| `npm run build` | TypeScript compile to dist/ |
| `npm run start` | Production (node dist/server.js) |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Apply migrations |

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Refine dev server |
| `npm run build` | TSC + Refine build |
| `npm run start` | Production server |
| `refine` | Refine CLI |

## 🌐 API Endpoints
Inferred from routes/ files (Express routers):
- `/classes` - Class management
- `/departments` - Departments
- `/enrollments` - Student enrollments
- `/stats` - Dashboard stats
- `/subjects` - Subjects
- `/users` - User management
- `/auth/*` - Better Auth endpoints

## 📱 Frontend Pages/Routes (Refine Resources)
- `/dashboard` - Stats overview
- `/classes` (list/create/show)
- `/departments` (list/create/show)
- `/faculty` (list/show)
- `/subjects` (list/create/show)
- `/enrollments` (create/join/confirm)
- `/login`, `/register`

Custom auth pages: `/login/custom`, `/register/custom`.

## 🔧 Development Workflow
1. Start backend: `cd classroom-backend && npm run dev`
2. Start frontend: `cd classroom-frontend && npm run dev`
3. Access: http://localhost:5173
4. DB changes: Edit schema/ → `db:generate` → `db:migrate`
5. UI components: `npx shadcn add <component>`
6. Refine resources: Follow Refine docs for new CRUD pages

**Note:** Fix TS build error by removing `paginationVariant="simple"` from DataTable usages in pages/*/show.tsx (prop not supported).

## 🚢 Deployment
- **Backend:** Vercel/Render (serverless), Railway
- **Frontend:** Vercel/Netlify (Vite static)
- **DB:** Neon (serverless Postgres)
- **Docker:** Dockerfile in frontend (adapt for backend)

```bash
# Backend build & deploy example (Vercel)
npm run build
vercel --prod

# Frontend
npm run build
# Deploy dist/ folder
```

## 🐛 Troubleshooting
- **Build Error (TS2322 DataTable):** Remove `paginationVariant="simple"` props.
- **Auth Issues:** Check AUTH_SECRET, DATABASE_URL, ports.
- **CORS:** Backend handles via cors middleware.
- **Migrations Fail:** Delete drizzle/meta/, regenerate.
- **apminsight Logs:** Ignore, auto-generated.

## 📄 License
ISC (see package.json)

## 🤝 Contributing
1. Fork & PR
2. Follow TypeScript/Shadcn conventions
3. Update schemas/migrations for DB changes
