# 🎓 Student Management UI (Frontend)

A modern, responsive Single Page Application (SPA) built with **React**, **TypeScript**, and **Vite**.  
Designed for real-time student administration, grade tracking, department management, and course enrollment with role-based access control and seamless JWT authentication lifecycle management.

---

## 🚀 Features

- **Single Page Application (SPA):** Fast, client-side routing via `react-router-dom` with custom dark-themed design system.
- **Robust Authentication & Interceptors:**
  - JWT token storage with auto-refresh mechanism using custom **Axios Interceptors**.
  - Transparent `401 Unauthorized` handling via background refresh token rotation without logging out active users.
  - Global `403 Forbidden` response interception providing user-friendly role access notifications.
- **Role-Based Access Control (RBAC):**
  - **ADMIN:** Full CRUD operations across Students, Departments, Courses, and Grades, plus course assignment, student status updates (Graduate/Suspend/Activate), and GPA calculations.
  - **USER:** Read-only access to records, search, and system statistics.
- **Dashboard & Analytics:** Live system overview displaying aggregate stats (students, courses, departments, grades) directly fetched from backend.
- **Advanced Management Modals:**
  - Multi-section modals for student department assignment, course enrollment, status transitions, and GPA calculation.
  - Course-to-Department dynamic binding and validation.
  - Dual-mode search functionality (search by Name or Email).
- **Pagination & Error Handling:** Server-side pagination controls and contextual user notifications for validation errors.

---

## 🛠️ Tech Stack

- **Core & Build:** React 18, TypeScript, Vite
- **Routing & HTTP:** React Router v6, Axios
- **Styling:** CSS3 (Vanilla CSS with CSS Variables, Dark Mode, Responsive Layouts)
- **Tooling:** ESLint, Oxlint

---

## 🏗️ Project Structure

```text
src/
├── api/             # Axios instance setup, interceptors, and feature service APIs
│   ├── axios.ts         # Central HTTP client with JWT & refresh interceptors
│   ├── authService.ts   # Login, Register, Logout endpoints
│   ├── studentService.ts# Student CRUD, search, department/course assignment, GPA
│   ├── courseService.ts # Course management API
│   └── departmentService.ts # Department management API
├── context/         # AuthContext for global user authentication state
├── pages/           # Page components (Dashboard, Students, Courses, Departments, Grades, Login, Register)
├── types/           # TypeScript interfaces (Student, Course, Department, Grade, Auth)
├── App.tsx          # Router configuration & protected routes
└── index.css        # Global CSS variables & design tokens
```

---

## 🔒 Authentication Flow & Interceptors

The frontend seamlessly handles authentication lifecycle:
1. **Login & Register:** Receives JWT Access Token and Refresh Token upon authentication.
2. **Request Interceptor:** Automatically attaches `Authorization: Bearer <token>` to every outgoing request.
3. **Response Interceptor:**
   - Unpacks API response envelope (`{ success, message, data }`).
   - If a request returns `401 Unauthorized`, it attempts a token refresh using `/auth/refresh`. If successful, it retries the original request seamlessly.
   - If a request returns `403 Forbidden`, it injects a user-friendly permission error notice.

---

## 💻 Local Setup & Execution

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lazarmihajlovic00-collab/student-management-ui.git
   cd student-management-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 🔗 Related Repositories

- **Backend API Repository:** [student-management-api](https://github.com/lazarmihajlovic00-collab/student-management-api) (Spring Boot 3, Java 21, PostgreSQL, Docker, CI/CD)
