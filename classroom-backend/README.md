# 🖥️ Classroom Backend API

The core engine of the Classroom Management System, built with Node.js and Express. It prioritizes type-safety, security, and performance monitoring.

## 🛠️ Tech Stack

- **Runtime**: Node.js / Express
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Security**: Arcjet (Bot protection, Rate limiting)
- **Auth**: Better Auth
- **Assets**: Cloudinary SDK
- **Monitoring**: APM Insight

## 🔑 Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `ARCJET_KEY` | API key for Arcjet security middleware |
| `BETTER_AUTH_SECRET` | Secret key for session management |
| `CLOUDINARY_URL` | Cloudinary credentials for image uploads |
| `PORT` | Local server port (default: 3000) |

## 🛣️ API Routes

### Authentication
- `POST /api/auth/*` - Handled by Better Auth

### Resources
- `GET /classes` - List all available classes
- `POST /classes` - Create a new class (Admin only)
- `GET /enrollments` - Retrieve student enrollment records
- `POST /enrollments` - Enroll a student in a class
- `GET /stats` - Aggregated data for dashboard widgets

## 🗄️ Database Management

This project uses Drizzle ORM for type-safe database interactions and migrations.

### Generate Migrations
Creates a SQL migration file based on your schema changes.
```bash
npm run db:generate
```

### Push Migrations
Applies pending migrations to the Neon PostgreSQL instance.
```bash
npm run db:migrate
```

*Note: Use `npm run db:studio` to open the Drizzle UI for visual data management.*