# PROMPTS LOG

This file logs all prompt executions, code changes, and commit hashes for the Car Dealership Inventory Management System.

---

## Prompt 1: Project Initialization & Core Architecture Setup

### Exact Prompt
> You are an expert Senior MERN Stack Engineer. We are building a production-ready Car Dealership Inventory Management System...

### Summary
Established the production-ready MERN project architecture with strict TDD workflow and Repository-Service-Controller setup.
- Initialized backend Node.js (ES Modules) environment with Express, Jest, Supertest, Mongoose, CORS, Morgan, Error Middleware.
- Followed TDD: Wrote `health.test.js` (RED) -> Implemented `app.js`, `health.routes.js`, `errorHandler.js` -> Verified tests passing (GREEN).
- Configured frontend React (Vite) app with Tailwind CSS, Glassmorphism design system (indigo primary, cyan accent), Lucide icons, Framer Motion, and React Hot Toast.
- Updated `README.md` and initial project configuration.

### Files Created
- `PROMPTS.md`
- `backend/package.json`
- `backend/jest.config.js`
- `backend/.env.example`
- `backend/src/app.js`
- `backend/src/middleware/errorHandler.js`
- `backend/src/routes/health.routes.js`
- `backend/src/tests/health.test.js`
- `frontend/package.json`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/src/index.css`
- `frontend/src/App.jsx`

### Files Modified
- `README.md`

### Manual Changes
- None.

### Commit Hash
35c4f945992fd0620591f22fbab1d87186d6e85a

---

## Prompt 2: Full Stack Engineer Role & Project Guidelines Setup

### Exact Prompt
> You are an expert Senior Full Stack Engineer.
> 
> We are building a Car Dealership Inventory System.
> 
> Tech Stack
> 
> Backend
> - Node.js
> - Express.js
> - JavaScript
> - MongoDB Atlas
> - Mongoose
> - JWT
> - bcrypt
> - Jest
> - Supertest
> 
> Frontend
> - React
> - Vite
> - Tailwind CSS
> - Axios
> - React Router
> - React Hook Form
> - React Testing Library
> 
> Rules
> 
> 1. Follow STRICT TDD.
> 2. Always work RED → GREEN → REFACTOR.
> 3. Never write implementation before tests.
> 4. All tests must pass before continuing.
> 5. Never break existing functionality.
> 6. Keep architecture clean.
> 7. Follow SOLID principles.
> 8. Use Repository → Service → Controller architecture.
> 9. Validate every input.
> 10. Use centralized error handling.
> 11. Never hardcode secrets.
> 12. Use environment variables.
> 13. Generate clean commit messages.
> 14. Push every successful feature to GitHub.
> 15. Update README.md after every feature.
> 16. Update PROMPTS.md after every AI interaction.
> 17. PROMPTS.md must contain:
>    - Exact prompt
>    - AI response summary
>    - Manual changes
>    - Final outcome
> 18. Append only. Never overwrite PROMPTS.md.
> 19. After every feature:
>    - git add .
>    - git commit
>    - git push
> 20. If anything fails, fix it before continuing.
> 21. After every prompt stop and wait for the next prompt.

### AI Response Summary
- Accepted Senior Full Stack Engineer role for the Car Dealership Inventory System.
- Confirmed full alignment with all 21 project development rules, strict TDD workflow (RED → GREEN → REFACTOR), and Repository-Service-Controller architecture.
- Verified environment variables, clean code standards, input validation, and GitHub repository integration.

### Manual Changes
- None.

### Final Outcome
- Project guidelines and tech stack rules locked in. System standing by for the next feature requirement prompt.

