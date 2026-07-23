# 🚗 AutoSphere — Car Dealership Inventory Management System

A full-stack **Car Dealership Inventory Management System** featuring a **Node.js/Express REST API** backend and a modern **React (Vite) + Tailwind CSS** frontend. Built with a **Repository-Service-Controller Architecture**, comprehensive **test coverage**, and **role-based access control**.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [API Documentation](#-api-documentation)
- [Folder Structure](#-folder-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Author](#-author)
- [License](#-license)

---

## 🚘 Project Overview

**AutoSphere** is a dealership inventory platform that enables car dealerships to manage their vehicle catalog, process customer purchases, and handle administrative operations — all through a modern, responsive web interface.

### The Problem It Solves

Car dealerships need a centralized system to track vehicle inventory, manage stock levels, process purchases, and provide different levels of access to staff and customers. AutoSphere provides a role-based platform where:

- **Customers** can browse the showroom catalog, search and filter vehicles, and purchase available stock.
- **Administrators** can manage the entire inventory — add new vehicles, edit details, restock, soft-delete listings, and monitor real-time dealership statistics.

---

## ✨ Features

### Authentication & Authorization
- User registration and login with JWT-based authentication
- Password hashing with bcrypt (salt factor 10)
- Role-based access control (`user` and `admin` roles)
- Protected and admin-only route guards on both frontend and backend
- Automatic token injection via Axios interceptors

### Vehicle Inventory Management
- Full CRUD operations for vehicle listings (Create, Read, Update, Soft Delete)
- Vehicle details: Make, Model, Year, Price, Mileage, Fuel Type, Transmission, Stock, Image, Description
- Soft delete pattern — deleted vehicles are flagged, not permanently removed
- Dynamic stock badges: `In Stock`, `Low Stock`, `Out of Stock`

### Search & Filter
- Keyword search across Make and Model fields
- Filter by Fuel Type, Transmission, Price Range, and Year Range
- Sort by Price, Year, Mileage, or Date Added (ascending/descending)
- Server-side pagination with configurable page size

### Purchase & Restock Workflow
- Authenticated users can purchase vehicles (stock decremented automatically)
- Quantity validation and insufficient stock handling
- Admin-only restock endpoint to replenish vehicle inventory
- Toast notifications for purchase and restock actions

### Admin Dashboard
- Real-time statistics cards: Total Vehicles, Total Valuation, In-Stock Count, Out-of-Stock Count
- Interactive inventory management table with inline actions
- Vehicle Add/Edit modal with image URL support and form validation via `react-hook-form`
- Role-based UI — admin users see the Admin Dashboard; regular users see the Inventory catalog

### Responsive UI
- Fully responsive design using Tailwind CSS
- Fixed navigation bar with mobile hamburger menu drawer
- Notification center with action-based alerts (purchase, restock, delete events)
- Premium ambient background with subtle grid textures
- Footer with quick links and dealership contact information

### Testing
- 59 backend unit tests across 12 test suites (Jest + Supertest)
- 23 frontend unit tests across 13 test suites (Vitest + React Testing Library)
- Repository mocking for isolated unit tests without database connections

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
| :--- | :--- |
| React 18 | Component-based UI framework |
| JavaScript (ES Modules) | Application language |
| Vite | Build tool and development server |
| Tailwind CSS | Utility-first CSS framework |
| Axios | HTTP client with interceptors |
| React Router DOM v6 | Client-side routing with route guards |
| React Hook Form | Form state management and validation |
| React Hot Toast | Toast notification system |
| Lucide React | Icon library |
| Vitest | Unit test runner |
| React Testing Library | Component testing utilities |

### Backend

| Technology | Purpose |
| :--- | :--- |
| Node.js | JavaScript runtime |
| Express.js | Web application framework |
| JavaScript (CommonJS) | Application language |
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose | MongoDB ODM (Object Document Mapper) |
| JSON Web Token (JWT) | Stateless authentication |
| bcryptjs | Password hashing |
| Morgan | HTTP request logger |
| Jest | Unit test framework |
| Supertest | HTTP endpoint testing |

---

## 🏗️ Project Architecture

The backend implements a decoupled **Repository-Service-Controller** pattern:

```
Client (React + Vite)
       │
       ▼
HTTP / REST API (JWT Bearer Token)
       │
       ▼
Routes Layer (src/routes/*.routes.js)
       │
       ▼
Controller Layer (src/controllers/*.controller.js) ── Request Validation & HTTP Mapping
       │
       ▼
Service Layer (src/services/*.service.js) ── Core Business Logic & Authorization
       │
       ▼
Repository Layer (src/repositories/*.repository.js) ── Database Abstraction & Queries
       │
       ▼
Database Layer (MongoDB Atlas / Mongoose ODM)
```

### Authentication Flow

```
1. User submits credentials (POST /api/auth/login)
2. Server validates credentials against hashed password in MongoDB
3. Server generates a signed JWT token and returns it to the client
4. Client stores the token in localStorage
5. Axios interceptor attaches "Authorization: Bearer <token>" to every request
6. Backend middleware (protect) verifies the token on protected routes
7. Backend middleware (authorize) checks user role for admin-only routes
```

### Key Design Decisions

- **Separation of Concerns**: Controllers handle HTTP; Services contain business logic; Repositories isolate database queries
- **Repository Pattern**: Enables isolated unit testing by mocking the data layer
- **Soft Delete Pattern**: Deleted vehicles retain data integrity via `isDeleted: true` flags
- **Vite Proxy**: Frontend dev server proxies `/api` requests to the backend, avoiding CORS issues in development

---

## 📥 Installation Guide

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **MongoDB Atlas** cluster URI (or a local MongoDB instance)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Ridham703/incubyte.git
cd incubyte
```

### Step 2 — Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3 — Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4 — Configure Environment Variables

```bash
cd ../backend
cp .env.example .env
```

Edit the `.env` file and set your MongoDB connection string and JWT secret. See [Environment Variables](#-environment-variables) below.

### Step 5 — Seed the Database (Optional)

```bash
cd backend
npm run seed
```

This creates default user accounts and populates the database with 8 sample vehicles.

### Step 6 — Start the Backend Server

```bash
cd backend
npm run dev
```

The Express API server starts at **http://localhost:5000**.

### Step 7 — Start the Frontend Client

In a separate terminal:

```bash
cd frontend
npm run dev
```

The Vite development server starts at **http://localhost:3000**.

---

## 🔒 Environment Variables

Create a `.env` file in the `backend/` directory using the provided template:

```bash
cp backend/.env.example backend/.env
```

### Required Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port the backend server listens on | `5000` |
| `NODE_ENV` | Application environment | `development` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/dealership` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_super_secret_jwt_key_change_in_production` |
| `JWT_EXPIRES_IN` | JWT token expiration duration | `1d` |

> ⚠️ **Security Note**: Never commit your `.env` file to version control. The `.gitignore` already excludes it.

---

## 🌱 Database Seeding

Seed the database with sample data:

```bash
cd backend
npm run seed
```

This will create:

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| Admin 1 | `ridhammangroliya4080@gmail.com` | `Ridham@123` | `admin` |
| Admin 2 | `ridhammangroliya@gmail.com` | `Ridham@123` | `admin` |

Plus **8 sample vehicles** across various makes and models (Tesla, Porsche, BMW, Mercedes-Benz, etc.).

---

## 📑 API Documentation

### Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check — returns server status |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT token |
| `GET` | `/api/vehicles` | List vehicles with pagination, sorting, and filters |
| `GET` | `/api/vehicles/search` | Search vehicles by make, model, price, year, fuel, transmission |

### Protected Endpoints (Requires `Authorization: Bearer <token>`)

| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Any | Get authenticated user profile |
| `POST` | `/api/vehicles/:id/purchase` | Any | Purchase a vehicle (decrements stock) |
| `POST` | `/api/vehicles` | Admin | Add a new vehicle to inventory |
| `PUT` | `/api/vehicles/:id` | Admin | Full update of vehicle details |
| `PATCH` | `/api/vehicles/:id` | Admin | Partial update of vehicle details |
| `DELETE` | `/api/vehicles/:id` | Admin | Soft delete a vehicle from active inventory |
| `POST` | `/api/vehicles/:id/restock` | Admin | Restock vehicle inventory by quantity |

### Query Parameters for `GET /api/vehicles`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `search` | string | Keyword search across make and model |
| `fuelType` | string | Filter by fuel type (e.g., `Gasoline`, `Electric`, `Hybrid`) |
| `transmission` | string | Filter by transmission (e.g., `Automatic`, `Manual`) |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `minYear` | number | Minimum year filter |
| `maxYear` | number | Maximum year filter |
| `sortBy` | string | Sort field (`price`, `year`, `mileage`, `createdAt`) |
| `sortOrder` | string | Sort direction (`asc` or `desc`) |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Results per page (default: `10`) |

---

## 📁 Folder Structure

```
incubyte/
├── README.md
├── PROMPTS.md
├── .gitignore
├── .env.example
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB connection & disconnection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Register, Login, GetMe handlers
│   │   │   ├── health.controller.js   # Health check handler
│   │   │   └── vehicle.controller.js  # Vehicle CRUD, Purchase, Restock handlers
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT verification & role authorization
│   │   │   └── errorHandler.js        # Global error handling middleware
│   │   ├── models/
│   │   │   ├── user.model.js          # Mongoose User schema
│   │   │   └── vehicle.model.js       # Mongoose Vehicle schema
│   │   ├── repositories/
│   │   │   ├── user.repository.js     # User data access layer
│   │   │   └── vehicle.repository.js  # Vehicle data access layer
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # Authentication routes
│   │   │   ├── health.routes.js       # Health check route
│   │   │   └── vehicle.routes.js      # Vehicle API routes
│   │   ├── scripts/
│   │   │   └── seed.js                # Database seeding script
│   │   ├── services/
│   │   │   ├── auth.service.js        # Authentication business logic
│   │   │   └── vehicle.service.js     # Vehicle business logic
│   │   ├── tests/                     # Jest test suites (12 files, 59 tests)
│   │   ├── app.js                     # Express app setup & middleware
│   │   └── server.js                  # HTTP server entrypoint
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── jest.config.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js               # Axios instance with interceptors
    │   ├── components/
    │   │   ├── AdminRoute.jsx         # Admin-only route guard
    │   │   ├── Footer.jsx             # Site footer with quick links
    │   │   ├── Layout.jsx             # Page layout wrapper with background
    │   │   ├── Navbar.jsx             # Navigation bar with notifications
    │   │   ├── Pagination.jsx         # Page navigation controls
    │   │   ├── ProtectedRoute.jsx     # Authenticated route guard
    │   │   ├── PurchaseModal.jsx      # Vehicle purchase confirmation dialog
    │   │   ├── RestockModal.jsx       # Admin restock dialog
    │   │   ├── SearchFilters.jsx      # Search & filter controls
    │   │   ├── VehicleCard.jsx        # Vehicle display card
    │   │   └── VehicleModal.jsx       # Add/Edit vehicle form modal
    │   ├── context/
    │   │   ├── AuthContext.jsx        # Authentication provider
    │   │   ├── AuthContextInstance.js # Shared context instance
    │   │   └── useAuth.js            # Auth custom hook
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx    # Admin management panel
    │   │   ├── Dashboard.jsx          # Public vehicle catalog
    │   │   ├── Login.jsx              # Login page
    │   │   ├── NotFound.jsx           # 404 page
    │   │   └── Register.jsx           # Registration page
    │   ├── test/
    │   │   └── setup.js               # Test environment setup
    │   ├── App.jsx                    # Root component with routing
    │   ├── index.css                  # Global styles
    │   └── main.jsx                   # Vite entry point
    ├── .eslintrc.json
    ├── .prettierrc
    ├── index.html
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🧪 Testing

### Backend Tests (Jest + Supertest)

```bash
cd backend
npm test
```

**12 test suites** | **59 tests passing**

| Test Suite | Tests | Coverage Area |
| :--- | :--- | :--- |
| `auth.test.js` | 8 | Register, Login, GetMe endpoints |
| `db.test.js` | 4 | MongoDB connection and disconnection |
| `health.test.js` | 2 | Health check and 404 handling |
| `middleware.test.js` | 6 | JWT verification and role authorization |
| `vehicle.delete.test.js` | 4 | Soft delete (admin-only) |
| `vehicle.get.test.js` | 3 | Pagination, sorting, filtering |
| `vehicle.model.test.js` | 8 | Schema validation and defaults |
| `vehicle.purchase.test.js` | 5 | Purchase flow and stock validation |
| `vehicle.restock.test.js` | 5 | Restock flow (admin-only) |
| `vehicle.routes.test.js` | 6 | Vehicle creation and validation |
| `vehicle.search.test.js` | 2 | Search by make, model, price, year |
| `vehicle.update.test.js` | 6 | Update flow and validation |

### Frontend Tests (Vitest + React Testing Library)

```bash
cd frontend
npm test
```

**13 test suites** | **23 tests passing**

Tests cover component rendering, user interactions, API mocking, form validation, route guarding, and authentication context.

### Linting

```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint
```

---

## 🚀 Deployment

### Backend (Render / Railway / Heroku)

1. Set the start command:
   ```bash
   npm start
   ```
2. Configure environment variables on your hosting platform:
   - `NODE_ENV=production`
   - `MONGO_URI=<your-production-mongodb-uri>`
   - `JWT_SECRET=<strong-random-secret>`
   - `PORT=5000`

### Frontend (Vercel / Netlify)

1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Set the environment variable:
   - `VITE_API_URL=https://your-backend-api.example.com/api`
3. Deploy the `dist/` output directory.

---

## 🖼️ Screenshots

> Screenshots can be added here after deployment.

| View | Description |
| :--- | :--- |
| **Login Page** | Clean login form with email/password validation |
| **Registration Page** | User registration with role selection |
| **Vehicle Catalog** | Responsive grid of vehicle cards with search, filters, and pagination |
| **Admin Dashboard** | Statistics cards, inventory table, and management actions |
| **Vehicle Modal** | Add/Edit form with image URL support and validation |
| **Purchase Dialog** | Confirmation modal with quantity input and stock validation |
| **Restock Dialog** | Admin-only modal for replenishing vehicle stock |

---

## 🔮 Future Improvements

- **Image Upload**: Add cloud-based image storage (e.g., Cloudinary, AWS S3) for vehicle photos
- **Pagination on Admin Table**: Server-side pagination for the admin inventory table
- **User Profile Page**: Allow users to view purchase history and update account details
- **Email Notifications**: Send order confirmation emails on successful purchases
- **Rate Limiting**: Add API rate limiting to protect against abuse
- **Swagger/OpenAPI**: Auto-generated interactive API documentation
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions
- **Dark Mode**: Toggle between light and dark UI themes

---

## 👤 Author

**Ridham Mangroliya**

- GitHub: [@Ridham703](https://github.com/Ridham703)
- Email: ridhammangroliya@gmail.com

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
