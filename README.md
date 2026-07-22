# Car Dealership Inventory Management System

A production-ready, full-stack **Car Dealership Inventory Management System** built with **TypeScript**, **Node.js**, **Express.js**, **MongoDB Atlas**, and **React (Vite)** adhering strictly to **Test-Driven Development (TDD)** and **Repository-Service-Controller Architecture**.

---

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Mongoose ORM (`src/config/db.ts`)
- **Data Models**: User Model (`user.model.ts`), Vehicle Model (`vehicle.model.ts` - Make, Model, Year, Price, Mileage, FuelType, Transmission, Stock, Image, Description)
- **Authentication & Middleware**: JWT `protect` & `authorize('admin')` RBAC Middleware (`src/middleware/auth.middleware.ts`)
- **Testing**: Jest (`ts-jest`) & Supertest (Isolated TDD Environment with Mongoose & Repository mocks)
- **Security & Utilities**: Bearer Token Verification, Role-Based Route Protection, Centralized Error Handling

### API Endpoints
- `GET /api/health` - System health check status
- `POST /api/auth/register` - User registration (name, email, password, role)
- `POST /api/auth/login` - User authentication & JWT token generation
- `GET /api/auth/me` - Fetch authenticated user profile (Protected route)
- `POST /api/vehicles` - Add new vehicle to inventory (Admin Protected route)
- `GET /api/vehicles` - Fetch paginated vehicles with sorting (`sortBy`, `sortOrder`) & filtering (`make`, `fuelType`, `transmission`, `minPrice`, `maxPrice`, `search`)
- `GET /api/vehicles/search` - Multi-attribute vehicle search (`make`, `model`, `minPrice`, `maxPrice`, `minYear`, `maxYear`, `fuelType`, `transmission`, `page`, `limit`)
- `PUT /api/vehicles/:id` / `PATCH /api/vehicles/:id` - Update vehicle details (Admin Protected route)
- `DELETE /api/vehicles/:id` - Soft delete vehicle from inventory (Admin Protected route)
- `POST /api/vehicles/:id/purchase` - Purchase vehicle and decrement stock (Protected route)
- `POST /api/vehicles/:id/restock` - Restock vehicle and increment stock (Admin Protected route)

### Frontend
- **Framework**: React + Vite (JSX / JS)
- **Styling**: Tailwind CSS (Dark Glassmorphic Theme with Indigo Primary & Cyan Accent)
- **Pages & Components**:
  - `src/pages/AdminDashboard.jsx`: Restricted admin portal with real-time statistics analytics cards, interactive inventory CRUD table, & search
  - `src/components/VehicleModal.jsx`: Add / Edit vehicle form modal with React Hook Form validation connecting to `POST /api/vehicles` & `PUT /api/vehicles/:id`
  - `src/components/RestockModal.jsx`: Restock modal dialog connecting to `POST /api/vehicles/:id/restock`
  - `src/pages/Dashboard.jsx`: Inventory showroom dashboard displaying vehicles, loading skeletons, and error retry states
  - `src/components/VehicleCard.jsx`: Vehicle card displaying image, specs, formatted price tag, stock status badges, & purchase button (disabled when stock is 0)
  - `src/components/PurchaseModal.jsx`: Purchase confirmation modal dialog connecting to `POST /api/vehicles/:id/purchase`
  - `src/components/SearchFilters.jsx`: Keyword search bar, multi-attribute filter panel (Fuel, Transmission, Price, Year, Sorting), & reset button
  - `src/components/Pagination.jsx`: Dynamic page navigation bar with page numbers, prev/next controls, and items summary counter
  - `src/pages/Login.jsx`: Login page with React Hook Form validation, JWT token storage, & toast notifications
  - `src/pages/Register.jsx`: Register page supporting user/admin registration with React Hook Form validation
- **Architecture**:
  - `src/api/axios.js`: Axios instance with JWT Authorization Bearer request interceptor & 401 response interceptor
  - `src/context/AuthContext.jsx` & `src/context/useAuth.js`: Global Auth Provider & custom hook managing user state and persistence
  - `src/components/ProtectedRoute.jsx`: Guards authenticated user routes
  - `src/components/AdminRoute.jsx`: Guards admin-only management routes
  - `src/components/Navbar.jsx` & `src/components/Layout.jsx`: Responsive top navigation bar with brand logo, user badges, role indicator, and layout wrapper
- **Testing**: Vitest + React Testing Library (`npm test` inside `frontend`)
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
