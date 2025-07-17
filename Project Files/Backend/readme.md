 # 🏥 Healthcare Appointment System – Backend

This repository contains the **Express.js + MongoDB backend** for the **Healthcare Appointment System**, which includes APIs for:

- User Authentication  
- Doctor Registration and Approval  
- Appointment Booking  
- Admin Controls  

---

## 📁 Project Structure

```
backend/
│
├── .env                         # Environment variables
├── index.js                     # App entry point
├── package.json                 # Project metadata and dependencies
│
├── config/                      # DB connection config
├── controllers/                 # Request handler logic
│   ├── adminC.js                # Admin functions
│   ├── doctorC.js               # Doctor operations
│   └── userC.js                 # User functions
│
├── middlewares/                # Custom middleware
│   └── authMiddleware.js       # JWT-based route protection
│
├── routes/                     # API route files
│   ├── adminRoutes.js
│   ├── doctorRoutes.js
│   └── userRoutes.js
│
├── schemas/                    # MongoDB models (Mongoose)
│   ├── appointmentModel.js
│   ├── docModel.js
│   └── userModel.js
│
├── uploads/                    # File upload directory
└── .gitignore
```

---

## 🚀 Features

- 🔐 **JWT Authentication** (with user/admin/doctor roles)
- 👨‍⚕️ **Doctor Application Flow** (approval by admin)
- 📅 **Appointment Booking**
- ⚙️ **Admin Panel APIs** (users/doctors management)
- 🛡️ **Role-Based Access Control** via Middleware

---

## 🛠️ Backend Setup Guide

Follow these steps to get the backend up and running on your local machine:

---

### ✅ Prerequisites

Before starting, ensure the following are installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A REST client like [Postman](https://www.postman.com/) (for testing)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/healthcare-appointment-system.git
cd healthcare-appointment-system/backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env` file in the `backend/` directory and add:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key
```

> ✅ Replace `your_database_name` and `your_jwt_secret_key` with your actual values.

---

### 4️⃣ Start MongoDB

Start your local MongoDB service:

```bash
# Linux/macOS
sudo service mongod start

# Windows (MongoDB must be installed and running as a service)
```

Or use **MongoDB Atlas** and replace the `MONGO_URI` accordingly.

---

### 5️⃣ Run the Server

**For normal run:**

```bash
node index.js
```

**For development (auto-reload with changes):**

```bash
npx nodemon index.js
```

You should see:

```bash
✅ Server running on http://localhost:5000
✅ Connected to MongoDB
```

---

## 🌐 API Endpoints Summary

| Endpoint                   | Method | Role   | Description                          |
| -------------------------- | ------ | ------ | ------------------------------------ |
| `/api/user/register`       | POST   | Public | Register a new user                  |
| `/api/user/login`          | POST   | Public | Login & receive JWT                  |
| `/api/user/apply-doctor`   | POST   | User   | Submit a doctor application          |
| `/api/admin/get-users`     | GET    | Admin  | View all registered users            |
| `/api/admin/update-status` | POST   | Admin  | Approve or reject doctor applications|
| `/api/doctor/appointments` | GET    | Doctor | View doctor’s appointments           |

> 🔐 All protected routes require a **JWT token** in the `Authorization` header:  
> Example:  
> `Authorization: Bearer <your_token_here>`

---

## 🔍 Testing the APIs

- Use **Postman** or **Thunder Client** (VS Code extension)
- Include token in the headers for protected routes
- Example workflow:
  1. Register user → `/api/user/register`
  2. Login → get token → `/api/user/login`
  3. Apply as doctor → `/api/user/apply-doctor` (with token)
  4. Admin reviews → `/api/admin/update-status`

---

## 📦 Useful Packages Used

| Package        | Purpose                      |
| -------------- | ---------------------------- |
| **express**    | Backend framework            |
| **mongoose**   | MongoDB ODM                  |
| **jsonwebtoken** | Token-based authentication |
| **bcryptjs**   | Password hashing             |
| **multer**     | File uploads (e.g., images)  |
| **dotenv**     | Environment config           |
| **cors**       | Cross-origin access          |
| **nodemon**    | Auto-reload on code changes  |

---

## 💡 Tips

- Use `console.log()` or install `morgan` for HTTP logging.
- Make sure MongoDB is running (or Atlas URI is correct).
- Use strong secrets in `.env` for security.
- Always test endpoints via Postman before frontend integration.
