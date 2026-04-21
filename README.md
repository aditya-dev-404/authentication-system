#  MERN Authentication System

A full-stack authentication system built using the MERN stack with features like email verification, 
OTP-based password reset, and secure cookie-based authentication.

---

##  Features

-  User Registration & Login
-  Email Verification using OTP
-  Password Reset via OTP
-  Secure Authentication using HTTP-only cookies
-  Protected Routes
-  Fully deployable (Frontend + Backend)

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer (for sending OTP emails)

---

---

## ⚙️ Environment Variables

### Backend (`/server/.env`)


PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_app_password


### Frontend (`/client/.env`)


VITE_BACKEND_URL=http://localhost:8080


---

## 🔧 Installation & Setup

### 1. Clone the repository

git clone https://github.com/aditya-dev-404/authentication-system
cd MernAuthentication

2. Setup Backend
cd server
npm install
npm run dev
3. Setup Frontend
cd client
npm install
npm run dev

---

Authentication Flow

-Signup
User registers with email & password
OTP is sent to email
User verifies OTP
Account gets activated
-Login
User logs in with credentials
JWT token is stored in HTTP-only cookie
User session is maintained securely
-Forgot Password
User enters email
OTP is sent
User verifies OTP
User sets new password



