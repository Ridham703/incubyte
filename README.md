# 🚗 Car Dealership Inventory Management System

A production-ready, full-stack **Car Dealership Inventory Management System** featuring a **TypeScript Node.js/Express REST API** backend and a modern **React (Vite) + Tailwind CSS Glassmorphic** frontend. Built adhering strictly to **Test-Driven Development (TDD)**, **Repository-Service-Controller Architecture**, and **WCAG Accessibility Standards**.

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture](#-architecture)
3. [Tech Stack](#-tech-stack)
4. [Installation](#-installation)
5. [Running Locally](#-running-locally)
6. [Environment Variables](#-environment-variables)
7. [API Documentation](#-api-documentation)
8. [Folder Structure](#-folder-structure)
9. [Testing](#-testing)
10. [Deployment](#-deployment)
11. [Screenshots & UI Showcase](#-screenshots--ui-showcase)
12. [AI Usage](#-ai-usage)
13. [Contribution](#-contribution)
14. [Troubleshooting](#-troubleshooting)
15. [License](#-license)

---

## 🚘 Project Overview

AutoSphere is a dealership platform designed to handle car inventory management, sales tracking, and administrative operations.

### Key Capabilities
- **Live Showroom Catalog**: Real-time vehicle cards featuring vehicle image thumbnails, specifications (Make, Model, Year, Mileage, Fuel Type, Transmission), dynamic pricing, and live stock badges (`In Stock`, `Low Stock`, `Out of Stock`).
- **Advanced Multi-Attribute Search & Filter**: Instant search across Make/Model, fuel type selector, transmission selector, price range sliders, manufacturing year filters, and sorting (price, year, mileage, recency).
- **Vehicle Purchase Flow**: Authenticated customer vehicle purchasing with quantity validation, automated stock decrementing, out-of-stock disabling, and toast notifications.
- **Admin Management Portal**: Role-Based Access Control (`admin`) guarding real-time statistics cards (Total Inventory, Valuation, In-Stock, Out-of-Stock count), interactive CRUD table, and search.
- **Vehicle Add & Edit Forms**: Modal supporting creation and updates with dual image handling (**Image URL** or **File Dropzone Upload** with FileReader Base64 preview) and `react-hook-form` validation.
- **Inventory Restock Endpoint**: Admin stock replenishment dialog with validation.
- **WCAG Accessibility (a11y)**: Full ARIA attribute compliance (`aria-label`, `aria-expanded`, `role="dialog"`, `aria-modal`, `aria-live`, `aria-invalid`, `aria-describedby`) and keyboard focus rings (`focus:ring-2 focus:ring-indigo-500`).

---

## 🏗️ Architecture

The backend implements a decoupled **Repository-Service-Controller Pattern**:

```
Client (React + Vite)
       │
       ▼
HTTP / REST API (JWT Bearer Token)
       │
       ▼
Routes Layer (`src/routes/*.routes.ts`)
       │
       ▼
Controller Layer (`src/controllers/*.controller.ts`) ── Request Validation & HTTP Mapping
       │
       ▼
Service Layer (`src/services/*.service.ts`) ── Core Business Logic & Authorization Checks
       │
       ▼
Repository Layer (`src/repositories/*.repository.ts`) ── Database Abstraction & Queries
       │
       ▼
Database Layer (MongoDB Atlas / Mongoose ORM)
```

### Architectural Guarantees
- **Separation of Concerns**: Controllers process HTTP request/response DTOs; Services contain pure business domain logic; Repositories isolate database queries.
- **Repository Pattern & Mockability**: Enables isolated unit testing without requiring active database connections during test runs.
- **Soft Delete Pattern**: Deleted vehicles retain data integrity via `isDeleted: true` flags, excluded automatically from active catalog queries (`{ isDeleted: { $ne: true } }`).
- **Security & Authorization**: Passwords hashed with `bcryptjs` (salt factor 10); Stateless authentication powered by `jsonwebtoken` (JWT); Role-Based Access Control (`user` vs `admin`).

---

## 🛠️ Tech Stack

### Backend
- **Language & Runtime**: TypeScript, Node.js
- **Framework**: Express.js
- **Database & ORM**: MongoDB Atlas, Mongoose ORM
- **Authentication**: JSON Web Token (`jsonwebtoken`), Password Hashing (`bcryptjs`)
- **Testing**: Jest (`ts-jest`), Supertest
- **Code Quality**: ESLint, TypeScript Strict Mode

### Frontend
- **Framework & Build Tool**: React 18, Vite
- **Styling & UI**: Tailwind CSS (Dark Glassmorphic Theme), Lucide React Icons
- **Form Management**: React Hook Form
- **State & HTTP**: React Context API, Axios (with Interceptors)
- **Routing**: React Router DOM (v6) with Protected & Admin Route Guards
- **Notifications**: React Hot Toast
- **Testing**: Vitest, React Testing Library (RTL)

---

## 📥 Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB Atlas cluster URI or local MongoDB instance

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ridham703/incubyte.git
   cd incubyte
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🏃 Running Locally

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
The Express TypeScript API server starts at `http://localhost:5000`. You can verify system health by calling `http://localhost:5000/api/health`.

### 2. Start the Frontend Client
In a separate terminal:
```bash
cd frontend
npm run dev
```
The Vite development server starts at `http://localhost:3000`.

---

## 🔒 Environment Variables

Copy the `.env.example` file in the `backend` directory to `.env`:

```bash
cp backend/.env.example backend/.env
```

### Backend `.env` Configuration Options
```env
# Server Port Configuration
PORT=5000

# Node Environment
NODE_ENV=development

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dealership?retryWrites=true&w=majority

# JWT Authentication Secret & Expiry
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CORS_ORIGIN=http://localhost:3000
```

---

## 📑 API Documentation

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning server status |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`, `role`) |
| `POST` | `/api/auth/login` | Authenticate user & return JWT Bearer token |
| `GET` | `/api/vehicles` | List vehicles with search, filters (`fuelType`, `minPrice`), & pagination |
| `GET` | `/api/vehicles/search` | Multi-attribute search query endpoint |
| `GET` | `/api/vehicles/:id` | Fetch single vehicle details by ID |

### Protected Endpoints (Requires `Authorization: Bearer <token>`)
| Method | Endpoint | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/me` | User / Admin | Get authenticated user profile |
| `POST` | `/api/vehicles/:id/purchase` | User / Admin | Purchase 1 unit of a vehicle and decrement stock |
| `POST` | `/api/vehicles` | Admin | Add new vehicle to dealership inventory |
| `PUT` | `/api/vehicles/:id` | Admin | Full update of existing vehicle details |
| `PATCH` | `/api/vehicles/:id` | Admin | Partial update of vehicle details |
| `DELETE` | `/api/vehicles/:id` | Admin | Soft delete vehicle from active inventory |
| `POST` | `/api/vehicles/:id/restock` | Admin | Restock vehicle inventory by quantity |

---

## 📁 Folder Structure

```
incubyte/
├── PROMPTS.md                       # Comprehensive prompt execution & change logs
├── README.md                        # Project documentation & reference manual
├── .gitignore                       # System-wide git ignore rules
├── .env.example                     # Root environment variable template
├── backend/                         # Express + TypeScript API (TDD Architecture)
│   ├── src/
│   │   ├── config/                  # DB connection & environment configuration
│   │   ├── controllers/             # HTTP Controllers (Auth, Vehicle, Health)
│   │   ├── middleware/              # JWT Auth, Admin Authorization, Error Handlers
│   │   ├── models/                  # Mongoose Schemas & TypeScript interfaces
│   │   ├── repositories/            # Data Access Layer (User, Vehicle repositories)
│   │   ├── routes/                  # Express route routers
│   │   ├── services/                # Business Domain Services
│   │   ├── utils/                   # Helper functions & custom AppError
│   │   ├── tests/                   # TDD Jest test suite (`*.test.ts`)
│   │   ├── app.ts                   # Express Application setup & middleware binding
│   │   └── server.ts                # HTTP Server entrypoint
│   ├── tsconfig.json                # TypeScript compiler configuration
│   ├── jest.config.js               # Jest TDD test runner configuration
│   └── package.json
└── frontend/                        # React + Vite Glassmorphic Client
    ├── src/
    │   ├── api/                     # Axios client instance with request/response interceptors
    │   ├── components/              # Modular Glassmorphic UI Components
    │   │   ├── Navbar.jsx           # Accessible navigation bar with mobile drawer
    │   │   ├── VehicleCard.jsx      # Showroom vehicle display card
    │   │   ├── PurchaseModal.jsx    # Purchase confirmation modal
    │   │   ├── VehicleModal.jsx     # Add/Edit vehicle form modal with File Upload
    │   │   ├── RestockModal.jsx     # Inventory restock dialog modal
    │   │   ├── SearchFilters.jsx    # Multi-attribute filter & search controls
    │   │   ├── Pagination.jsx       # Accessible page navigation controls
    │   │   ├── ProtectedRoute.jsx   # User authentication route guard
    │   │   └── AdminRoute.jsx       # Role-based admin route guard
    │   ├── context/                 # AuthContext & AuthProvider implementation
    │   ├── pages/                   # Main Views (Dashboard, AdminDashboard, Login, Register)
    │   ├── test/                    # RTL Setup & mock initializers
    │   ├── App.jsx                  # Main router configuration component
    │   └── main.jsx                 # Vite mounting entrypoint
    ├── vite.config.js               # Vite & Vitest configuration
    ├── tailwind.config.js           # Glassmorphism styling configuration
    └── package.json
```

---

## 🧪 Testing

### Running Backend Tests (Jest + Supertest)
The backend test suite verifies controller, service, repository, and middleware layers using Mongoose mocks and Supertest HTTP integration:

```bash
cd backend
npm test
```
- **Coverage**: 58/58 passing tests across 12 test suites.

### Running Frontend Tests (React Testing Library + Vitest)
The frontend test suite verifies component rendering, user interactions, form validation, route guarding, and API mocking:

```bash
cd frontend
npm test
```
- **Coverage**: 22/22 passing tests across 12 test suites.

### Running Code Quality Checkers
```bash
# Frontend Linting
cd frontend && npm run lint

# Backend Type Check
cd backend && npm run build
```

---

## 🚀 Deployment

### Backend Deployment (e.g., Render / Railway / Heroku)
1. Build the TypeScript production bundle:
   ```bash
   cd backend
   npm run build
   ```
2. Set Production Environment Variables on host platform:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-production-mongodb-connection-string>`
   - `JWT_SECRET=<strong-random-secret>`
   - `CORS_ORIGIN=<your-frontend-deployment-url>`
3. Set Start Command:
   ```bash
   npm start
   ```

### Frontend Deployment (e.g., Vercel / Netlify)
1. Build the Vite production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Set Environment Variable:
   - `VITE_API_URL=https://your-backend-api.onrender.com/api`
3. Deploy output `dist/` directory.

---

## 🖼️ Screenshots & UI Showcase

- **Showroom Catalog**: Responsive grid displaying vehicle cards with stock badges, specs, formatted pricing, and keyword search bar.
- **Admin Management Panel**: Real-time metric analytics cards (Total Inventory, Total Valuation, In-Stock, Out-of-Stock count), search bar, and inventory CRUD table.
- **Vehicle Form Modal**: Add/Edit vehicle form supporting direct image URLs and file drag-and-drop dropzone with FileReader Base64 thumbnail preview.
- **Purchase & Restock Dialogs**: Modal windows confirming purchases and stock increases.

---

## 🤖 AI Usage

This project was developed with assistance from **Antigravity (Google DeepMind)** operating as a pair programming assistant.

### AI Assistance Scope
- **Test-Driven Development (TDD)**: Generating unit test cases in Jest and Vitest prior to feature implementation.
- **Architecture Enforcement**: Ensuring strict separation of concerns across Controller, Service, and Repository layers.
- **Accessibility & UX**: Implementing WCAG compliant ARIA attributes, keyboard navigation focus rings, and responsive touch layouts.
- **Bug Resolution**: Refactoring React Context fast refresh exports and FileReader Base64 image conversions.

All code produced was verified via automated test suites and linting.

---

## 🤝 Contribution

Contributions are welcome! Please follow these guidelines:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.

---

## 🔧 Troubleshooting

### 1. MongoDB Connection Failure
- **Symptom**: `MongooseServerSelectionError` or connection timeout on server start.
- **Solution**: Ensure your IP address is whitelisted in MongoDB Atlas Network Access rules (or set to `0.0.0.0/0` for development). Verify `MONGODB_URI` string in `backend/.env`.

### 2. CORS Request Blocked
- **Symptom**: Browser console logs `Access-Control-Allow-Origin` error when calling API.
- **Solution**: Ensure `CORS_ORIGIN` in `backend/.env` matches the frontend server port (`http://localhost:3000`).

### 3. JWT Token Expiration / 401 Unauthorized
- **Symptom**: Admin or Purchase actions return 401 Unauthorized.
- **Solution**: Sign out and log back in to refresh token in `localStorage`. Ensure `JWT_SECRET` matches across restarts.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
