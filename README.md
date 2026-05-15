# 📋 Team Task Manager (TaskFlow)

A full-stack MERN application for managing team projects and tasks with role-based access control.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Update `.env` with your MongoDB URI and JWT secret:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_key
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 🔐 Roles

| Role   | Permissions |
|--------|-------------|
| Admin  | Create/edit/delete projects & tasks, assign members |
| Member | View projects they belong to, update status of their tasks |

## 📁 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
