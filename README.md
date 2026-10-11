# BloodConnect

A blood donor management platform connecting blood donors with patients in need.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **API:** REST APIs
- **Authentication:** JWT + bcryptjs

## Architecture

```
React + Vite + Tailwind CSS
        ↓ fetch() calls
Node.js + Express.js (REST API)
        ↓ Mongoose ODM
MongoDB
```

## Requirements

- Node.js (v18 or higher)
- npm
- MongoDB Atlas account (free tier works) or a local MongoDB instance

## Installation

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
cd ..
```

Or use the shortcut:

```bash
npm run server:install
```

## Environment Variables

### Frontend (.env)

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000/api
```

You can copy the example file:

```bash
cp .env.example .env
```

### Backend (server/.env)

Create a `.env` file in the `server/` directory:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string_at_least_32_chars
PORT=5000
CLIENT_URL=http://localhost:5173
```

You can copy the example file:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` and fill in your real values.

**IMPORTANT:** Never share your real `MONGODB_URI`, `JWT_SECRET`, or `.env` files publicly. These files are in `.gitignore` and should stay on your local machine only.

### Getting a MongoDB Atlas connection string

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Under **Database Access**, create a database user
4. Under **Network Access**, allow your IP address (or add `0.0.0.0/0` for anywhere)
5. Click **Connect** → **Connect your application** → copy the connection string
6. Paste it as the `MONGODB_URI` value in `server/.env`, replacing `<username>`, `<password>`, and `<cluster>`

### Generating a JWT secret

Run this in your terminal to generate a random 32+ character string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as the `JWT_SECRET` value in `server/.env`.

## Seed Demo Data

After setting up `server/.env` with a valid MongoDB connection string, run the seed script to populate the database with demo users, donors, and blood requests:

```bash
cd server
npm run seed
```

Or use the shortcut:

```bash
npm run server:seed
```

This creates:

- 1 admin account
- 1 demo user account
- 10 sample users
- 11 donor profiles
- 7 blood requests
- 2 donation records

### Demo Credentials

After seeding, you can log in with these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bloodconnect.org | admin12345 |
| User | demo@bloodconnect.org | demo12345 |

Passwords are hashed with bcryptjs in the database. These accounts are created by the seed script, not hardcoded in the frontend.

## Running the Project

You need two terminals running simultaneously.

### Terminal 1 — Start the backend server

```bash
cd server
npm run dev
```

The server starts on http://localhost:5000

### Terminal 2 — Start the frontend

```bash
npm run dev
```

The frontend starts on http://localhost:5173

Open http://localhost:5173 in your browser to use the app.

## Features

- **Home** — Landing page with live platform statistics
- **About** — Mission, vision, and project information
- **Find Blood** — Search for available donors by blood group and city
- **Register as Donor** — Create or update your donor profile
- **Create Blood Request** — Submit a blood request with urgency level
- **Blood Requests** — Browse, filter, and manage blood requests
- **Login / Signup** — JWT-based authentication with user and admin roles
- **User Dashboard** — View and edit profile, donor info, donation history, and your blood requests
- **Admin Dashboard** — Manage donors, blood requests, and view platform statistics
- **Contact** — Contact form that saves messages to the database
- **Responsive Design** — Works on mobile, tablet, and desktop

## API Routes

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Required | Get current user |
| PUT | `/api/auth/profile` | Required | Update profile |

### Donors

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/donors` | Public | List donors (supports bloodGroup, city, available filters) |
| GET | `/api/donors/me` | Required | Get own donor profile |
| POST | `/api/donors` | Required | Create donor profile |
| PUT | `/api/donors/:id` | Required | Update donor (owner or admin) |
| PATCH | `/api/donors/:id/availability` | Required | Toggle availability |
| DELETE | `/api/donors/:id` | Required | Delete donor (owner or admin) |

### Blood Requests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blood-requests` | Public | List requests (supports status, bloodGroup, city filters) |
| GET | `/api/blood-requests/me` | Required | Get own requests |
| POST | `/api/blood-requests` | Required | Create blood request |
| PUT | `/api/blood-requests/:id` | Required | Update request (owner or admin) |
| DELETE | `/api/blood-requests/:id` | Required | Delete request (owner or admin) |

### Donations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/donations` | Required | Get own donations |
| POST | `/api/donations` | Required | Log a donation |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/donors` | Admin | List all donors |
| GET | `/api/admin/blood-requests` | Admin | List all requests |

### Contact

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | Public | Submit contact message |

## Project Structure

```
bloodconnect/
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Donor.js
│   │   ├── BloodRequest.js
│   │   ├── Donation.js
│   │   └── ContactMessage.js
│   ├── routes/                # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── bloodRequestRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── adminRoutes.js
│   │   └── contactRoutes.js
│   ├── controllers/           # Route handler logic
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── adminMiddleware.js # Admin role check
│   ├── index.js               # Server entry point
│   ├── seed.js                # Demo data seeder
│   ├── package.json
│   └── .env.example
├── src/                       # React frontend
│   ├── components/            # Navbar, Footer, UI components
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state management
│   ├── lib/
│   │   └── api.ts             # REST API client
│   ├── pages/                 # All page components
│   ├── App.tsx                # Route definitions
│   ├── main.tsx               # App entry point
│   └── index.css              # Tailwind + custom styles
├── .env.example               # Frontend env template
├── package.json               # Frontend dependencies
└── README.md                  # This file
```
