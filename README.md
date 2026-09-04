# 🏥 MediSetu – Smart Healthcare Finder Platform

**Find Free & Affordable Healthcare Near You**

MediSetu is a full-stack AI-powered healthcare discovery platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It helps users find free and affordable hospitals based on symptoms, disease, and location.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ — https://nodejs.org
- **MongoDB** — https://mongodb.com/try/download/community (local) or https://mongodb.com/atlas (cloud free tier)
- **npm** v9+

---

## 📂 Project Structure

```
medisetu/
├── server/          ← Node.js + Express backend
│   ├── config/      ← DB connection, seed data
│   ├── controllers/ ← Business logic
│   ├── middleware/  ← Auth (JWT), error handlers
│   ├── models/      ← MongoDB Mongoose schemas
│   ├── routes/      ← API route definitions
│   └── server.js    ← Entry point
│
├── client/          ← React.js + Vite frontend
│   ├── src/
│   │   ├── components/  ← Reusable UI components
│   │   ├── context/     ← React Context (Auth)
│   │   ├── pages/       ← Page components
│   │   ├── services/    ← Axios API service
│   │   └── App.jsx      ← Router setup
│   └── index.html
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Step 1: Clone & install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/medisetu
JWT_SECRET=your_super_secret_key_here_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**To get your Anthropic API key:**
1. Go to https://console.anthropic.com
2. Create an account
3. Go to API Keys → Create Key
4. Paste it in `.env` as `ANTHROPIC_API_KEY`

### Step 3: Seed the database (optional but recommended)

```bash
cd server
npm run seed
```

This creates:
- ✅ Admin account: `admin@medisetu.com` / `Admin@123`
- ✅ 4 sample hospitals in Surat, Gujarat
- ✅ 5 doctors
- ✅ 4 government schemes (PMJAY, MA Vatsalya, JSY, PMJAP)
- ✅ 2 blood banks

### Step 4: Run the app

**Terminal 1 – Start backend:**
```bash
cd server
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 – Start frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medisetu.com | Admin@123 |

Or register a new account at `/register`

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user (Protected)
- `PUT /api/auth/profile` — Update profile (Protected)

### Hospitals
- `GET /api/hospitals` — Get all hospitals (with filters)
- `GET /api/hospitals/:id` — Get hospital details
- `GET /api/hospitals/nearby?lat=&lng=` — Get nearby hospitals
- `POST /api/hospitals/register` — Register hospital (Hospital Admin)

### Appointments
- `POST /api/appointments` — Book appointment (Protected)
- `GET /api/appointments/my` — My appointments (Protected)
- `PUT /api/appointments/:id/cancel` — Cancel appointment

### AI
- `POST /api/ai/analyze` — Analyze symptoms (AI)
- `POST /api/ai/chat` — AI chatbot

### Admin (Admin only)
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/hospitals/pending` — Pending approvals
- `PUT /api/admin/hospitals/:id/status` — Approve/reject hospital

### Others
- `GET /api/blood-banks` — Blood bank finder
- `GET /api/schemes` — Government schemes
- `GET /api/emergency` — Emergency data

---

## 🌐 Pages

| Route | Description |
|-------|-------------|
| `/` | Home / Landing page |
| `/hospitals` | Hospital search + filters |
| `/hospitals/:id` | Hospital detail + booking |
| `/emergency` | Emergency mode |
| `/blood-bank` | Blood bank finder |
| `/schemes` | Government schemes |
| `/appointment/:hospitalId/:doctorId` | Book appointment |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | User dashboard |
| `/admin` | Admin panel |
| `/register-hospital` | Hospital registration |

---

## 🛠️ Tech Stack

**Frontend:** React.js + Vite, Tailwind CSS, Framer Motion, React Router v6, Axios, React Hot Toast, Lucide Icons

**Backend:** Node.js, Express.js, JWT Auth, REST API, Express Rate Limit

**Database:** MongoDB with Mongoose ODM (GeoSpatial 2dsphere indexes)

**AI:** Anthropic Claude API (claude-sonnet) for symptom analysis and chatbot

---

## 🗃️ Database Collections

- **Users** — Patients, hospital admins, platform admin
- **Hospitals** — Hospital listings with geo-coordinates
- **Doctors** — Doctor profiles linked to hospitals
- **Appointments** — Booking records
- **Reviews** — Hospital ratings and reviews
- **Schemes** — Government healthcare schemes
- **BloodBanks** — Blood bank availability
- **Medicines** — Medicine finder

---

## 🔒 Security Features

- JWT authentication with expiry
- Protected routes (frontend + backend)
- Role-based access control (user / hospital_admin / admin)
- Rate limiting on API (100 req / 15 min)
- Password hashing with bcrypt (12 rounds)
- CORS configured for frontend origin

---

## 🌍 Multi-Language Support

The app includes a language selector for English, Hindi (हिंदी), Gujarati (ગુજરાતી), and Urdu (اردو). Full i18n implementation can be added using `react-i18next`.

---

## 📦 Build for Production

```bash
# Build frontend
cd client
npm run build

# Start backend in production
cd ../server
NODE_ENV=production npm start
```

---

## 💡 Key Features

✅ AI-powered symptom analysis (Claude API)  
✅ Location-based hospital discovery  
✅ Free vs paid treatment filtering  
✅ Government scheme navigator  
✅ Online appointment booking  
✅ Hospital rating & reviews  
✅ Emergency mode with helplines  
✅ Blood bank finder  
✅ Admin dashboard  
✅ Hospital self-registration portal  
✅ JWT authentication  
✅ Responsive mobile-first design  

---

Made with ❤️ for India | © 2025 MediSetu
