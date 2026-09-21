# TaskFlow — Advanced MERN To-Do List Application

A complete MERN task-management application implementing the requested advanced architecture.

## Requirements covered

- React.js frontend
- Node.js + Express.js backend
- MongoDB + Mongoose
- Complete CRUD using REST APIs
- React Hooks and reusable components
- Pending / In-Progress / Completed workflow
- Server-side validation with dedicated validation middleware
- Structured centralized error handling
- Pagination, filtering, searching and sorting
- JWT-based authentication
- bcrypt password hashing
- User-specific protected tasks
- Clean separation of routes, controllers, models and middleware
- Server-side dashboard statistics
- Environment-based configuration

## Project structure

```text
mern-todo-app/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── services/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── .gitignore
└── README.md
```

## Run locally

### 1. MongoDB

Start MongoDB locally or create a MongoDB Atlas database.

### 2. Backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Set these values in `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
NODE_ENV=development
```

### 3. Frontend

Open another terminal:

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

Open the Vite URL shown in the terminal.

## REST API

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/stats`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

All task routes require:

```text
Authorization: Bearer <JWT>
```

### Query parameters

```text
GET /api/tasks?page=1&limit=8
GET /api/tasks?status=Pending
GET /api/tasks?priority=High
GET /api/tasks?search=project
GET /api/tasks?sortBy=dueDate&order=asc
```

Parameters can be combined.

## Architecture

```text
React Components
      ↓
Custom Hooks / Axios
      ↓
REST API
      ↓
Express Routes
      ↓
Auth + Validation Middleware
      ↓
Controllers
      ↓
Mongoose Models
      ↓
MongoDB
```
