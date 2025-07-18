# 🩺 Doctor Appointment Booking App – Backend

This is the **backend API** for the Doctor Appointment Booking System. It manages users, doctors, appointments, and admin functionalities using **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Folder Structure

```

backend/
├── controllers/       # Business logic for routes
├── models/            # Mongoose schemas for MongoDB
├── routes/            # API endpoints
├── utils/             # Middleware and helpers
├── createAdmin.js     # Script to create an admin
├── deleteUsers.js     # Script to delete users
├── listUsers.js       # Script to list users
├── app.js             # Express app setup
├── server.js          # Entry point
├── .env.example       # Environment variable template
├── package.json       # Dependencies
└── README.md          # Backend documentation

````

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Environment Config**: dotenv
- **Password Hashing**: bcryptjs
- **CORS Handling**: cors

---

## 🚀 Getting Started

### 1. Navigate to Backend Folder

```bash
cd backend
````

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

Then fill in your own values:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

### 4. Run the Server (Development Mode)

```bash
npm run dev
```

> Server runs on: `http://localhost:5000`

---

## 🔌 Sample API Endpoints

| Method | Endpoint              | Description                     |
| ------ | --------------------- | ------------------------------- |
| POST   | `/api/users/register` | Register a new user             |
| POST   | `/api/users/login`    | User login and token generation |
| POST   | `/api/doctors/apply`  | Apply to be a doctor            |
| POST   | `/api/appointments`   | Book a new appointment          |
| GET    | `/api/admin/doctors`  | Admin: List all doctors         |
| PUT    | `/api/admin/status`   | Admin: Approve/reject doctor    |

More routes are available in the `routes/` folder.

---

## 🧪 Optional: Running Tests

> If you add Mocha, Chai, or Jest

```bash
npm install --save-dev mocha chai supertest
npm test
```

---

## 🔐 Security Best Practices

* Do **not commit** the actual `.env` file to GitHub.
* Use `.env.example` as a safe public template.
* Always hash passwords before storing them.
* Use HTTPS in production deployments.

---

## ☁ Deployment Notes

| Layer    | Recommended Service          |
| -------- | ---------------------------- |
| Backend  | Render, Railway, Heroku, VPS |
| Database | MongoDB Atlas                |

---


```

