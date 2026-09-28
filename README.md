# 🏥 Book-A-Doctor

**BookADoctor** is your one-stop platform for effortless doctor appointment booking online.  
Designed and implemented with a clean **MERN Stack** architecture (MongoDB, Express, React.js, Node.js) with in-memory database fallback for zero-configuration startup.

---

## 🔗 DEMO AND GITHUB REPOSITORY LINKS

> [!IMPORTANT]
> - 🌐 **Project DOC :** https://drive.google.com/drive/folders/1ozwAVSwNVUuEmhdsHQ6WOxKvLDzaXwCY?usp=sharing
> - ⚡ **Live Frontend (Vercel):** https://book-a-doctor-one-peach.vercel.app/
> - 🚀 **Live Backend API (Render):** https://book-a-doctor-v1ai.onrender.com
> - 🐙 **GitHub Repository:** https://github.com/bharathcse24-sud/book-a-doctor
> - 🔑 **Pre-configured Admin Account**
>   - Account Email: `admin@gmail.com`
>   - Password: `admin123`

---

## 1. PROJECT ARCHITECTURE

### TECHNICAL ARCHITECTURE

The application follows a decoupled client-server architecture:

```
----------------------------------------------------------
                      FRONTEND LAYER
----------------------------------------------------------
| - React 18 (Create React App)
| - Vanilla CSS Design System + Global Styles
| - Context API (AuthContext)
| - React Router DOM Navigation
| - Pages: Home, Doctors, DoctorProfile, BookAppointment,
|          MyAppointments, Login, Register, AdminDashboard
----------------------------------------------------------
                          |
                  REST API (HTTP / JSON)
                          |
----------------------------------------------------------
                      BACKEND LAYER
----------------------------------------------------------
| - Node.js & Express.js REST API Server
| - JWT Authentication & Bcrypt Password Hashing
| - Controllers: AuthController, DoctorController,
|                AppointmentController, AdminController
| - In-Memory DB Fallback (no MongoDB required to start)
----------------------------------------------------------
                          |
----------------------------------------------------------
                      DATABASE LAYER
----------------------------------------------------------
| - MongoDB (Users, Doctors, Appointments)
| - Mongoose ORM + Auto-seeding on first connection
----------------------------------------------------------
```

### ER DIAGRAM

```
┌─────────────────┐         ┌──────────────────────┐
│      USER        │         │       DOCTOR          │
├─────────────────┤         ├──────────────────────┤
│ _id             │         │ _id                  │
│ name            │         │ name                 │
│ email (unique)  │         │ email (unique)        │
│ password (hash) │         │ specialty            │
│ role            │         │ experience           │
│ phone           │         │ qualifications[]     │
│ avatar          │         │ bio                  │
│ createdAt       │         │ avatar               │
└────────┬────────┘         │ fees                 │
         │                  │ available (bool)     │
         │                  │ availableSlots[]     │
         │ 1                │ rating               │
         │                  │ reviews[]            │
         │ N                │ createdAt            │
┌────────▼────────────────────────────────────────┐
│                  APPOINTMENT                     │
├─────────────────────────────────────────────────┤
│ _id                                             │
│ patient  → ref: User                            │
│ doctor   → ref: Doctor                          │
│ date                                            │
│ time                                            │
│ status (pending/confirmed/cancelled/completed)  │
│ reason                                          │
│ notes                                           │
│ reports[] (name, url, uploadedAt)               │
│ createdAt                                       │
└─────────────────────────────────────────────────┘
```

### FEATURES

1. **User Registration & Login** — JWT-based secure authentication with bcrypt password hashing.
2. **Browse Doctors** — Filter by specialty (Cardiology, Dermatology, Neurology, Pediatrics, Orthopedics, Ophthalmology, and more), search by name.
3. **Doctor Profiles** — Detailed profiles with qualifications, experience, bio, available slots, ratings, and consultation fees.
4. **Book Appointments** — Select a doctor, pick date and time slot, submit reason for visit.
5. **My Appointments** — View all booked appointments with live status updates (Pending, Confirmed, Cancelled, Completed).
6. **Upload Medical Reports** — Attach reports (PDF/Images) to appointments via Cloudinary.
7. **Admin Dashboard** (`admin@gmail.com` / `admin123`):
   - Dashboard stats: Total users, doctors, appointments by status.
   - Manage all appointments — update status (Confirm, Complete, Cancel).
   - Manage registered users — view and delete accounts.
8. **In-Memory Fallback** — Works fully without a local MongoDB instance. Data is stored in memory automatically when MongoDB is not connected.

### USER FLOW

```
[ Visitor / Guest ]
        |
        ▼
[ Browse Home / Find Doctors ]
        |
        ├──► Click "Find Doctors" ──► Filter by Specialty / Search by Name
        |                                         |
        |                                         ▼
        |                              [ Doctor Profile Page ]
        |                                         |
        |                                         ▼
        |                              [ Book Appointment ]
        |                                    (Login Required)
        |
        ├──► Register / Login ──► JWT Token Stored in localStorage
        |
        ├──► My Appointments ──► View Status / Cancel Appointment
        |
        └──► Upload Medical Reports ──► Attach to Appointment

[ Admin ]
        |
        ▼
[ Admin Dashboard ]
        |
        ├──► View Stats (Users / Doctors / Appointments)
        ├──► Manage All Appointments (Confirm / Complete / Cancel)
        └──► Manage Users (View / Delete)
```

### MVC PATTERN EXPLANATION

- **Model Layer** (`server/models/`) — Mongoose models defining schemas for `User.js`, `Doctor.js`, and `Appointment.js`.
- **View Layer** (`client/src/`) — Dynamic React components with global CSS, responsive grid structures, and interactive states.
- **Controller Layer** (`server/controllers/`) — Business logic processing requests, performing database CRUD operations, and returning structured JSON API payloads.

---

## 2. PROJECT SETUP AND CONFIGURATION

### Folder Structure

```
Book-A-Doctor/
├── client/                    # React Frontend (Create React App)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/        # Navbar, Footer, DoctorCard, AppointmentCard
│       ├── context/           # AuthContext
│       ├── hooks/             # useAuth
│       ├── pages/             # Home, Doctors, Login, Register, etc.
│       ├── services/          # api.js (Axios API calls)
│       └── utils/
├── server/                    # Node.js + Express Backend
│   ├── config/                # db.js, cloudinary.js
│   ├── controllers/           # authController, doctorController, etc.
│   ├── middleware/             # authMiddleware, roleMiddleware, dbCheck
│   ├── models/                # User, Doctor, Appointment schemas
│   ├── routes/                # authRoutes, doctorRoutes, etc.
│   ├── services/              # emailService
│   ├── utils/                 # generateToken, memoryStore (fallback DB)
│   ├── validators/            # authValidator, appointmentValidator
│   ├── seedAdmin.js           # Seed default admin account
│   ├── seedDoctors.js         # Seed 30 sample doctors
│   └── server.js
├── docs/                      # PDF Documentation
├── postman/                   # Postman API Collection
├── package.json               # Root scripts (concurrently)
└── README.md
```

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/bharathcse24-sud/book-a-doctor.git
cd book-a-doctor
```

#### 2. Server Setup
```bash
cd server
npm install
```

#### 3. Client Setup
```bash
cd ../client
npm install
```

---

## 3. BACKEND DEVELOPMENT

### Backend Server Configuration (`server/server.js`)

- Express app mounts routes: `/api/auth`, `/api/doctors`, `/api/appointments`, `/api/upload`, `/api/admin`.
- Middleware: CORS enabled, JSON parsing, JWT validation.
- Auto-connects to MongoDB on startup; falls back to in-memory store if unavailable.

### API Routes

#### Auth Routes (`/api/auth`)
| Method | Endpoint             | Access   | Description              |
|--------|----------------------|----------|--------------------------|
| POST   | `/api/auth/register` | Public   | Register a new user      |
| POST   | `/api/auth/login`    | Public   | Login and get JWT token  |
| GET    | `/api/auth/profile`  | Private  | Get logged-in user info  |
| PUT    | `/api/auth/profile`  | Private  | Update user profile      |

#### Doctor Routes (`/api/doctors`)
| Method | Endpoint              | Access       | Description              |
|--------|-----------------------|--------------|--------------------------|
| GET    | `/api/doctors`        | Public       | List all doctors         |
| GET    | `/api/doctors/:id`    | Public       | Get doctor by ID         |
| POST   | `/api/doctors`        | Admin Only   | Create new doctor        |
| PUT    | `/api/doctors/:id`    | Admin Only   | Update doctor info       |
| DELETE | `/api/doctors/:id`    | Admin Only   | Delete a doctor          |

#### Appointment Routes (`/api/appointments`)
| Method | Endpoint                     | Access   | Description                |
|--------|------------------------------|----------|----------------------------|
| POST   | `/api/appointments`          | Private  | Book a new appointment     |
| GET    | `/api/appointments/my`       | Private  | Get my appointments        |
| PUT    | `/api/appointments/:id/cancel` | Private | Cancel an appointment    |
| GET    | `/api/appointments`          | Admin    | Get all appointments       |

#### Admin Routes (`/api/admin`)
| Method | Endpoint                              | Access | Description                   |
|--------|---------------------------------------|--------|-------------------------------|
| GET    | `/api/admin/dashboard`                | Admin  | Dashboard statistics          |
| GET    | `/api/admin/users`                    | Admin  | Get all users                 |
| DELETE | `/api/admin/users/:id`                | Admin  | Delete a user                 |
| GET    | `/api/admin/appointments`             | Admin  | All appointments (filterable) |
| PUT    | `/api/admin/appointments/:id/status`  | Admin  | Update appointment status     |

### Database Seeding

On first MongoDB connection, the server auto-seeds:
- **Admin account** (`admin@gmail.com` / `admin123`)
- **30 sample doctors** across 6 specialties (Cardiology, Dermatology, Neurology, Pediatrics, Orthopedics, Ophthalmology)

To seed manually:
```bash
cd server
node seedAdmin.js
node seedDoctors.js
```

---

## 4. DATABASE DEVELOPMENT (MongoDB)

- **MongoDB URI:** `mongodb://127.0.0.1:27017/book-a-doctor` (default)
- **Database connector:** `server/config/db.js` using Mongoose ORM
- **Zero-config fallback:** If MongoDB is not running, the app uses an in-memory store (`server/utils/memoryStore.js`) automatically — no setup required to test the app.

### Environment Variables (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/book-a-doctor
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Optional: Cloudinary for file uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 5. FRONTEND DEVELOPMENT

Built with **React 18** (Create React App), **Vanilla CSS** with a global design system.

### Key Pages

| Page                  | Route                      | Description                             |
|-----------------------|----------------------------|-----------------------------------------|
| Home                  | `/`                        | Hero section, features overview         |
| Find Doctors          | `/doctors`                 | Doctor listing with search & filter     |
| Doctor Profile        | `/doctors/:id`             | Detailed doctor info & slot selection   |
| Book Appointment      | `/book/:id`                | Appointment booking form                |
| Login                 | `/login`                   | User login                              |
| Register              | `/register`                | New user registration                   |
| My Appointments       | `/my-appointments`         | Patient's appointment history           |
| Upload Reports        | `/upload-reports`          | Medical report upload                   |
| Admin Dashboard       | `/admin`                   | Admin management panel                  |
| Admin Login           | `/admin/login`             | Admin login page                        |

### Key Components

- `Navbar` — Responsive navigation with auth-aware links
- `DoctorCard` — Doctor preview card with specialty, rating, fees
- `AppointmentCard` — Appointment details with status badge
- `Footer` — Site-wide footer
- `ProtectedRoute` — Guards private and admin-only routes

---

## 6. PROJECT EXECUTION

### Step 1: Start Backend API Server

```bash
cd server
npm start
# Running on http://localhost:5000
```

### Step 2: Start Frontend React Server

```bash
cd client
npm start
# Running on http://localhost:3000
```

### Or run both together from root:

```bash
npm run dev
# Starts both client and server concurrently
```

---

## 📋 DEMO & EVALUATION LINKS SUMMARY

- **⚡ Live Frontend (Vercel):** https://book-a-doctor-self.vercel.app
- **🚀 Live Backend API (Render):** https://book-a-doctor-v1ai.onrender.com
- **🐙 GitHub Repository:** https://github.com/bharathcse24-sud/book-a-doctor
- **Admin Email:** `admin@gmail.com`
- **Admin Password:** `admin123`

---

## 📄 License

MIT — Free to use for educational and personal projects.
