# DocSpot – Seamless Appointment Booking for Health

Booking a doctor’s appointment is easier than ever with **DocSpot**.  
Our online platform helps patients schedule appointments quickly and conveniently—no calls, no waiting.

---

## 🚀 Features

- ✅ Browse doctors and specialties  
- ✅ View **real-time slot availability**  
- ✅ Book appointments instantly  
- ✅ Choose flexible time slots – mornings, evenings, or weekends  
- ✅ Secure, fast, and user-friendly

---

## 🛠️ Tech Stack

### Frontend
- React.js (with TypeScript)
- HTML5, CSS3
- Redux Toolkit (state management)
- Axios (API calls)

### Backend
- Node.js & Express.js
- MongoDB (Database)
- JWT Authentication

---

## 📁 Project Structure

```
Doctors Appointment/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── createAdmin.js
│   ├── deleteUsers.js
│   ├── listUsers.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── errorController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── appointmentModel.js
│   │   ├── doctorModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── doctorRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── appError.js
│   │   └── catchAsync.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.test.tsx
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── bottomLogo.svg
│   │   │       ├── doc.png
│   │   │       ├── doctor-appointment.png
│   │   │       ├── nexCenterLogo.svg
│   │   │       ├── p2.png
│   │   │       └── photo1.png
│   │   ├── components/
│   │   │   ├── CustomChip/
│   │   │   ├── DatePicker/
│   │   │   ├── Heading/
│   │   │   ├── MUITable/
│   │   │   ├── Navbar/
│   │   │   ├── PhoneInput/
│   │   │   ├── PrimaryInput/
│   │   │   └── Spinner/
│   │   ├── hooks/
│   │   ├── redux/
│   │   │   ├── alertSlice.ts
│   │   │   ├── api/
│   │   │   │   ├── apiSlice.ts
│   │   │   │   ├── authApiSlice.ts
│   │   │   │   ├── doctorSlice.ts
│   │   │   │   ├── notificationApiSlice.ts
│   │   │   │   └── userSlice.ts
│   │   │   ├── auth/
│   │   │   │   └── authSlice.ts
│   │   │   └── store.ts
│   │   ├── routes/
│   │   │   ├── ProtectedRoutes.tsx
│   │   │   └── PublicRoutes.tsx
│   │   ├── utils/
│   │   └── views/
│   │       ├── ApplyDoctor/
│   │       ├── Appointments/
│   │       ├── Dashboard/
│   │       ├── Doctors/
│   │       ├── Login/
│   │       ├── NotFound/
│   │       ├── Notifications/
│   │       ├── Profile/
│   │       ├── Signup/
│   │       └── Users/
│   ├── package.json
│   └── README.md
│
├── package-lock.json
└── README.md
```

### Backend

- `controllers/` – Business logic for users, doctors, appointments, and authentication
- `models/` – Mongoose models (User, Doctor, Appointment)
- `routes/` – API endpoints for users and doctors
- `utils/` – Error handling and async utilities
- `server.js` – Entry point for the backend server

### Frontend

- `src/components/` – Reusable UI components (Navbar, Table, Inputs, etc.)
- `src/views/` – Page-level components (Dashboard, Appointments, Login, Signup, etc.)
- `src/redux/` – State management (slices, API logic)
- `src/routes/` – Route definitions (protected/public)
- `src/assets/` – Images and static assets
- `src/utils/` – Utility functions

---

## ⚡ Getting Started

### 1. Prerequisites

- Node.js (v14+)
- npm
- MongoDB (local or cloud)
- Git

---

### 2. Clone the Repository

```bash
git clone <your-repo-url>
cd Doctors\ Appointment
```

---

### 3. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file in `backend/` with the following (example):

  ```
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/docspot
  JWT_SECRET=your_jwt_secret
  ```

- Start the backend server:

  ```bash
  npm start
  ```

---

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

- (Optional) Create a `.env` file in `frontend/`:

  ```
  REACT_APP_API_URL=http://localhost:5000/api
  ```

- Start the React development server:

  ```bash
  npm start
  ```

- The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Building for Production

- **Frontend:**  
  Run `npm run build` in `frontend/` to generate optimized static files.

- **Backend:**  
  Deploy the backend to your preferred Node.js hosting (Heroku, Render, etc.).

---

## 🧪 Testing

- **Frontend:**  
  Run `npm test` in `frontend/` (if tests are available).

- **Backend:**  
  Add and run tests as needed.

---

## 🐞 Troubleshooting

- **Port already in use:**  
  Change the port in your `.env` file.

- **API connection issues:**  
  Ensure both backend and frontend are running, and `REACT_APP_API_URL` is correct.

- **MongoDB connection issues:**  
  Check your `MONGO_URI` and MongoDB service.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

For issues, open an issue in the repository or contact the maintainer.
