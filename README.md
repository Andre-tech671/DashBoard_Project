# Classroom Management Dashboard

A full-stack web application for managing educational classrooms, departments, faculty, subjects, and student enrollments. Built with modern technologies for a responsive admin dashboard.

## ✨ Features

- **Authentication & Authorization**: Secure login/register/custom auth flows with Better Auth
- **Dashboard**: Overview with stats and analytics (`/stats`)
- **Full CRUD Operations**:
  - **Faculty**: List, show (`/faculty`)
  - **Classes**: Create, list, show (`/classes`)
  - **Departments**: Create, list, show (`/departments`)
  - **Subjects**: Create, list, show (`/subjects`)
  - **Enrollments**: Create, join, confirm (`/enrollments`)
  - **Users**: Management (`/users`)
- **Responsive Admin UI**: shadcn/ui + custom Refine UI components (buttons, data-tables, forms, layout)
- **File Uploads**: Cloudinary integration
- **Monitoring**: apminsight
- **API-Driven**: Full REST backend
- **Database**: PostgreSQL + Drizzle ORM (Neon serverless)
- **Security**: Arcjet, Helmet, CORS

## 📁 Complete Project Structure

```
DashBoard_Project/
├── README.md
├── classroom-backend/                          # Full API Backend
│   ├── .gitignore
│   ├── apminsightnode.json                    # Monitoring config
│   ├── drizzle.config.js                      # Drizzle config
│   ├── package.json                           # Backend deps/scripts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── express.d.ts
│   │   ├── index.ts                           # Server entry
│   │   ├── type.d.ts
│   │   ├── config/arcjet.ts
│   │   ├── db/index.ts
│   │   │   └── schema/ (app.ts, auth.ts, index.ts)
│   │   ├── lib/ (auth.ts, cloudinary.ts)
│   │   ├── middleware/security.ts
│   │   └── routes/ (classes.ts, departments.ts, enrollments.ts, stats.ts, subjects.ts, users.ts)
│   ├── drizzle/ (migrations: 0000_*.sql, meta/)
│   └── apminsightdata/ (logs, json - auto-generated monitoring)
└── classroom-frontend/                         # React Dashboard
    ├── .gitignore, .npmrc, components.json, Dockerfile
    ├── eslint.config.js, index.html, package.json, tsconfig*.json, vite.config.ts
    ├── README.MD (frontend-specific)
    ├── public/favicon.ico
    ├── src/
    │   ├── App.tsx, App.css, index.tsx, vite-env.d.ts
    │   ├── components/
    │   │   ├── upload-widget.tsx
    │   │   ├── refine-ui/ (buttons: clone/create/delete/edit/list/refresh/show; data-table: *; form: *; layout: *; notification: *; theme; views)
    │   │   └── ui/ (shadcn: accordion, alert*, avatar, badge, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input*, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle*, tooltip)
    │   ├── constants/index.ts
    │   ├── hooks/use-mobile.ts
    │   ├── lib/ (auth-client.ts, cloudinary.ts, schema.ts, utils.ts)
    │   ├── pages/
    │   │   ├── dashboard.tsx
    │   │   ├── classes/ (create.tsx, list.tsx, show.tsx)
    │   │   ├── departments/ (create.tsx, list.tsx, show.tsx)
    │   │   ├── enrollments/ (confirm.tsx, create.tsx, join.tsx)
    │   │   ├── faculty/ (list.tsx, show.tsx)
    │   │   ├── login/ (custom.tsx, index.tsx)
    │   │   └── register/ (custom.tsx, index.tsx)
    │   │   └── subjects/ (create.tsx, list.tsx, show.tsx)
    │   ├── providers/ (auth.ts, data.ts)
    │   └── types/index.ts
```

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **Database**: PostgreSQL + Drizzle ORM (Neon serverless)
- **Auth**: Better Auth
- **Security**: Arcjet, Helmet, CORS
- **Utils**: Cloudinary (image upload), apminsight (monitoring)

### Frontend
- **Framework**: React + Vite + TypeScript
- **UI**: shadcn/ui + Refine UI components
- **Routing**: React Router (via Refine)
- **Data**: Refine data providers (REST API)
- **Auth**: Custom auth client

## 📋 Prerequisites

- Node.js (v20+)
- PostgreSQL or Neon account (for DB)
- Cloudinary account (optional, for uploads)
- Arcjet token (for security)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo> DashBoard_Project
cd DashBoard_Project
```

#### Backend
```bash
cd classroom-backend
npm install
cp .env.example .env  # Configure DATABASE_URL, AUTH_SECRET, etc.
npm run db:generate
npm run db:migrate
```

#### Frontend
```bash
cd ../classroom-frontend
npm install
cp .env.example .env  # Configure API_URL
```

### 2. Run Development Servers

#### Backend
```bash
cd classroom-backend
npm run dev
```
Server runs on `http://localhost:3001`

#### Frontend
```bash
cd classroom-frontend
npm run dev
```
App runs on `http://localhost:5173`

### 3. Build for Production

#### Backend
```bash
cd classroom-backend
npm run build
npm start
```

#### Frontend
```bash
cd classroom-frontend
npm run build
npm run start  # or deploy 'dist/'
```

## 🔌 API Endpoints

Base URL: `http://localhost:3001/api`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/stats` | GET | Dashboard statistics | Yes |
| `/classes` | GET/POST | List/Create classes | Yes |
| `/classes/:id` | GET/PUT/DELETE | Show/Update/Delete class | Yes |
| `/departments` | GET/POST | List/Create departments | Yes |
| `/faculty` | GET/POST | List/Create faculty | Yes |
| `/subjects` | GET/POST | List/Create subjects | Yes |
| `/enrollments` | GET/POST | List/Create/Journal enrollments | Yes |
| `/users` | GET/POST | User management | Yes |
| `/auth/*` | POST | Login/Register/Custom | No |

## 🌍 Environment Variables

### Backend Scripts (npm run)
- `dev`: tsx watch src/index.ts
- `build`: tsc
- `start`: node dist/server.js
- `db:generate`: drizzle-kit generate
- `db:migrate`: drizzle-kit migrate

### Backend (.env)
```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key (min 32 chars)
ARCJET_KEY=your-arcjet-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=3001
NODE_ENV=development
```

### Frontend Scripts (npm run)
- `dev`: Vite dev server
- `build`: Vite build
- `start`: Preview production build

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_CLOUDINARY_CLOUD_NAME=...
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_CLOUDINARY_CLOUD_NAME=...
```

## 🐛 Troubleshooting

- **DB Connection**: Ensure `DATABASE_URL` is correct (Neon/Postgres)
- **CORS Issues**: Check backend CORS config
- **Auth Errors**: Verify `AUTH_SECRET` matches
- **Migrations**: Run `npm run db:generate && npm run db:migrate`

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🙌 Acknowledgments

Built with ❤️ using Refine, shadcn/ui, Drizzle, Better Auth, and more!

---
⭐ Star us on GitHub!
