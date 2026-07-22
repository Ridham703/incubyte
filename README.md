# Car Dealership Inventory Management System

A production-ready, full-stack **Car Dealership Inventory Management System** built using the MERN stack with strict **Test-Driven Development (TDD)** and **Repository-Service-Controller Architecture**.

---

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Mongoose ORM
- **Testing**: Jest & Supertest (Isolated TDD Environment)
- **Security & Utilities**: JWT, bcryptjs, dotenv, cors, morgan

### Frontend
- **Framework**: React + Vite (JSX)
- **Styling**: Tailwind CSS (Dark Glassmorphic Theme with Indigo Primary & Cyan Accent)
- **State & Router**: React Router DOM, React Hook Form
- **UI & Animations**: Framer Motion, Lucide React, React Hot Toast
- **HTTP Client**: Axios

---

## 📁 Project Architecture

```
incubyte/
├── PROMPTS.md                       # Execution prompt log & commit history
├── README.md                        # Documentation & Setup instructions
├── backend/                         # Node.js & Express API (TDD enabled)
│   ├── src/
│   │   ├── config/                  # DB & System Config
│   │   ├── controllers/             # Request Handlers
│   │   ├── middleware/              # Error & Validation Middleware
│   │   ├── models/                  # Mongoose Data Schemas
│   │   ├── repositories/            # Data Access Layer
│   │   ├── routes/                  # API Endpoint Definitions
│   │   ├── services/                # Core Business Logic
│   │   ├── tests/                   # TDD Jest Test Suites
│   │   └── app.js                   # Application Entrypoint
└── frontend/                        # React + Vite Glassmorphic UI
    ├── src/
    │   ├── api/                     # Axios API Config
    │   ├── components/              # Modular Glassmorphism Components
    │   └── App.jsx                  # Main Application Component
```

---

## 🧪 Testing (TDD Workflow)

Run the backend test suite:
```bash
cd backend
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

### 2. Run Frontend Client
```bash
cd frontend
npm install
npm run dev
```
