Doctor’s Appointment System – Frontend Setup Guide

This is the **React.js frontend** for the **Doctor's Appointment System**, built to interact seamlessly with the Express backend. It supports patients, doctors, and admins with dynamic routing, protected pages, and real-time API integration.

---

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

- 🔐 **Login/Register** (Users, Doctors, Admins)  
- 🩺 **Doctor Application Form** and Status View  
- 📅 **Book & View Appointments**  
- ⚙️ **Admin Management Panel**  
- 🧭 **Role-based Routing** with Protected Routes  
- 📲 **API Integration** with JWT Support (Axios)  

---

## ▶️ How to Set Up the Frontend

### 1️⃣ Navigate to the Frontend Directory

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

> Replace `http://localhost:5000` with your actual backend base URL if running in production.

### 4️⃣ Start the React App

```bash
npm start
```

The app will start in development mode and open at:  
🌐 [http://localhost:3000](http://localhost:3000)

> The app supports **hot reloading**, so it refreshes automatically on changes.

---

## 🌐 API Integration

- All API requests are handled using **Axios** (`src/axios.js`)
- JWT tokens are included via `Authorization: Bearer <token>` headers
- Tokens are stored in `localStorage` and managed via Context API

---

## 🔧 Tech Stack

| Tool          | Purpose                                |
| ------------- | -------------------------------------- |
| **React**     | Frontend framework                     |
| **React Router** | Client-side routing                |
| **Axios**     | HTTP requests to backend APIs          |
| **JWT**       | Secure authentication                  |
| **Context API** | Global auth & user state management |
| **Tailwind CSS** / CSS | Styling for the UI           |

---

## 🧪 Tips

- Always run the backend before starting the frontend to avoid CORS/API issues.
- Check browser console/network tab for any failed requests or 401 errors.
- Customize the API base URL from `.env` if deploying.
