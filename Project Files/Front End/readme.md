-- Doctor’s Appointment System – Frontend Setup Guide

This is the **React.js** frontend for the Doctor's Appointment System, built to interact seamlessly with the Express backend. It includes functionality for patients, doctors, and admins, with dynamic routing, protected pages, and real-time updates via API integration.

## 📁 Project Structure Overview

```
frontend/
│
├── public/                     # Static files and index.html
├── src/
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Page-level views (Login, Register, Dashboard, etc.)
│   ├── routes/                 # Route protection and layout structure
│   ├── context/                # Global state (e.g., Auth context)
│   ├── utils/                  # Axios instance, helpers, etc.
│   ├── App.js                  # Main routing and layout logic
│   ├── index.js                # React entry point
│   └── axios.js                # API base URL config
│
├── .env                        # Environment variables
├── package.json                # Scripts and dependencies
└── README.md
```

---

## 🚀 Key Frontend Features

* 🔐 **Login/Register** (Users, Doctors, Admins)
* 🩺 **Doctor Application** form and status view
* 📅 **Book & View Appointments**
* ⚙️ **Admin Management Panel**
* 🧭 **Role-based Routing** with Protected Routes
* 📲 **API integration** with JWT support (Axios)

---

## ▶️ How to Set Up the Frontend

### 1️⃣ Go to the Frontend Directory

```bash
cd frontend
```

### 2️⃣ Install Required Dependencies

```bash
npm install
```

### 3️⃣ Set Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

> Replace `http://localhost:5000` with your backend base URL if different (e.g., production URL).

### 4️⃣ Start the React App

```bash
npm start
```

This runs the app in development mode at:
🌐 `http://localhost:3000`

The app will reload automatically on code changes.

---

## 🌐 API Integration

* All API requests use `Axios`, configured in `axios.js`
* JWT is attached via `Authorization: Bearer <token>` headers
* Auth tokens are stored in `localStorage`

---

## 🔧 Tech Stack

| Tool               | Purpose                       |
| ------------------ | ----------------------------- |
| React              | Frontend UI                   |
| React Router       | Client-side routing           |
| Axios              | HTTP requests to backend APIs |
| JWT                | Authentication                |
| Context API        | Global auth & user state      |
| Tailwind CSS / CSS | Styling framework             |

---

---


