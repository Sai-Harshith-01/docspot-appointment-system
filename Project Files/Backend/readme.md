 Backend Setup Guide – Healthcare Appointment System

This is the **Express.js + MongoDB backend** for the Healthcare Appointment System, which provides APIs for user authentication, doctor registration, appointment booking, and admin control.

---

## 📁 Backend Folder Structure

```
backend/
│
├── .env                         # Environment variables (PORT, DB URI, JWT_SECRET)
├── index.js                     # Entry point - Starts the Express server
├── package.json                 # Dependencies and scripts
│
├── config/                      # MongoDB connection config (optional)
├── controllers/                # Route handler functions
│   ├── adminC.js               # Admin-related operations
│   ├── doctorC.js              # Doctor operations
│   └── userC.js                # User-related operations
│
├── middlewares/
│   └── authMiddleware.js       # Middleware for JWT authentication
│
├── routes/
│   ├── adminRoutes.js          # Admin routes (manage users, doctors)
│   ├── doctorRoutes.js         # Doctor-specific APIs
│   └── userRoutes.js           # Public/user routes (register, login, apply)
│
├── schemas/
│   ├── appointmentModel.js     # Schema for appointments
│   ├── docModel.js             # Schema for doctors
│   └── userModel.js            # Schema for users
│
├── uploads/                    # Folder for file uploads (e.g., profile pictures)
└── .gitignore
```

---

## 🚀 Key Functionalities

* 🔐 **JWT Authentication** with role-based access control
* 👨‍⚕️ **Doctor Application Flow** with admin approval
* 📅 **Appointment Booking System**
* ⚙️ **Admin Dashboard APIs** (manage users, doctors)
* 🛡️ **Middleware-based Route Protection**

---

## ▶️ Steps to Run the Backend

### 1️⃣ Navigate to the Backend Directory

```bash
cd backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key
```

> Replace `your_database_name` and `your_jwt_secret_key` with actual values.

### 4️⃣ Start the Backend Server

```bash
node index.js
# OR, for development (auto-reload):
npx nodemon index.js
```

---

## 🌐 API Endpoints Overview

| Endpoint                   | Method | Role   | Description                          |
| -------------------------- | ------ | ------ | ------------------------------------ |
| `/api/user/register`       | POST   | Public | Register new user                    |
| `/api/user/login`          | POST   | Public | Login & get JWT                      |
| `/api/user/apply-doctor`   | POST   | User   | Apply as a doctor                    |
| `/api/admin/get-users`     | GET    | Admin  | Get list of all users                |
| `/api/admin/update-status` | POST   | Admin  | Approve or reject doctor application |
| `/api/doctor/appointments` | GET    | Doctor | View appointments                    |

> 🔐 All protected routes require a valid JWT token in the `Authorization` header.

---

## 💡 Helpful Tips

* Make sure MongoDB is running locally or use MongoDB Atlas.
* Use tools like **Postman** or **Thunder Client** for API testing.
* Use `console.log()` or install `morgan` for HTTP request logging.

---

## 📘 Tech Stack Used

* **Express.js** – Web framework
* **MongoDB + Mongoose** – Database
* **JWT** – Authentication
* **Multer** – File upload support
* **dotenv** – Manage environment variables
* **bcryptjs** – Password hashing


