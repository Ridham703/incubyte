# Car Dealership Inventory Management System

A production-ready, full-stack **Car Dealership Inventory Management System** built with **TypeScript**, **Node.js**, **Express.js**, **MongoDB Atlas**, and **React (Vite)** adhering strictly to **Test-Driven Development (TDD)** and **Repository-Service-Controller Architecture**.

---

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Mongoose ORM (`src/config/db.ts`)
- **Authentication & Middleware**: JWT `protect` & `authorize('admin')` RBAC Middleware (`src/middleware/auth.middleware.ts`)
- **Testing**: Jest (`ts-jest`) & Supertest (Isolated TDD Environment with Mongoose & Repository mocks)
- **Security & Utilities**: Bearer Token Verification, Role-Based Route Protection, Centralized Error Handling

### API Endpoints
- `GET /api/health` - System health check status
- `POST /api/auth/register` - User registration (name, email, password, role)
- `POST /api/auth/login` - User authentication & JWT token generation
- `GET /api/auth/me` - Fetch authenticated user profile (Protected route)

### Frontend
- **Framework**: React + Vite (JSX / JS)
- **Styling**: Tailwind CSS (Dark Glassmorphic Theme with Indigo Primary & Cyan Accent)
- **State & Routing**: React Router DOM, React Hook Form
- **UI & Animations**: Framer Motion, Lucide React, React Hot Toast
- **HTTP Client**: Axios
- **Testing**: React Testing Library & Vitest

---

## 📁 Project Architecture

```
incubyte/
├── PROMPTS.md                       # Execution prompt log & commit history
├── README.md                        # Project documentation & Setup guide
├── .gitignore                       # System-wide git ignore rules
├── .env.example                     # Environment template
├── backend/                         # Express + TypeScript API (TDD Enabled)
│   ├── src/
│   │   ├── config/                  # DB & System Configuration
│   │   ├── controllers/             # Express Request Handlers
│   │   ├── middleware/              # Centralized Error & Auth Middleware
│   │   ├── models/                  # Mongoose Schemas & TypeScript Interfaces
│   │   ├── repositories/            # Data Access Layer
│   │   ├── routes/                  # API Endpoint Definitions
│   │   ├── services/                # Core Business Logic
│   │   ├── utils/                   # Shared Helper Utilities
│   │   ├── tests/                   # TDD Jest Suite (`*.test.ts`)
│   │   ├── app.ts                   # Express App Configuration
│   │   └── server.ts                # Server Listen Entrypoint
│   ├── tsconfig.json                # TypeScript Config
│   ├── jest.config.js               # Jest Config (`ts-jest`)
│   └── package.json
└── frontend/                        # React + Vite Glassmorphic Client
    ├── src/
    │   ├── api/                     # Axios API Instance & Endpoints
    │   ├── components/              # Modular Glassmorphism UI Components
    │   ├── context/                 # React Context Providers
    │   ├── hooks/                   # Custom Hooks
    │   ├── pages/                   # Application Pages & Views
    │   ├── routes/                  # React Router Route Setup
    │   ├── styles/                  # Custom CSS & Utility Classes
    │   ├── test/                    # RTL Setup Configuration
    │   ├── App.jsx                  # Main Application Component
    │   ├── App.test.jsx             # React Testing Library Unit Test
    │   └── main.jsx                 # Vite Entry Point
    ├── vite.config.js               # Vite & Vitest Configuration
    ├── tailwind.config.js           # Glassmorphism Color Palette
    └── package.json
```

---

## 🧪 Testing (Strict TDD Workflow)

### Run Backend Tests (Jest + Supertest)
```bash
cd backend
npm test
```

### Run Frontend Tests (React Testing Library + Vitest)
```bash
cd frontend
npm test
```

---

## 🏃 Getting Started

### 1. Run Backend Server
```bash
cd backend
npm install
npm run dev
```
The API server will run on `http://localhost:5000`. Test the health check at `http://localhost:5000/api/health`.

### 2. Run Frontend Client
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will run on `http://localhost:3000`.

---

## 🔒 Environment Configuration

Copy `.env.example` to `.env` in both `/backend` and root directories before running:
```bash
cp .env.example .env
```
