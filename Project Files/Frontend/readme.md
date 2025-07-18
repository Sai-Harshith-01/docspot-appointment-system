# 🩺 Doctor Appointment Booking – Frontend

This is the **React + TypeScript frontend** for the Doctor Appointment Booking application.  
It provides patient, doctor, and admin interfaces for registration, profile management, appointment booking, and dashboard access.

---

## 🛠️ Tech Stack

- **React** (with TypeScript)
- **Redux Toolkit** + **RTK Query**
- **Material UI (MUI)** + **Bootstrap**
- **Formik** + **Yup** (form validation)
- **Axios** (API calls)
- **React Router DOM**

---

## 📁 Project Structure

```

frontend/
├── public/               # Static files (index.html, favicon, etc.)
├── src/
│   ├── assets/           # Images and static assets
│   ├── components/       # Reusable UI components (Navbar, Inputs, etc.)
│   ├── views/            # Pages (Login, Signup, Dashboard, etc.)
│   ├── redux/            # State management (slices, API logic)
│   ├── routes/           # Route guards (Public, Protected)
│   ├── utils/            # Helper functions/utilities
│   ├── App.tsx
│   └── index.tsx
├── .env                  # Environment variables
├── package.json
└── tsconfig.json

````

---

## ✅ Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn
- Backend running at `http://localhost:5000`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/frontend
````

---

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

---

### 3. Setup Environment Variables

Create a `.env` file in the `frontend/` directory with:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Make sure this matches your backend URL.

---

### 4. Run the App

```bash
npm start
# or
yarn start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing (Optional)

If tests are configured:

```bash
npm test
# or
yarn test
```

---

## 🐞 Troubleshooting

| Issue               | Fix                                                |
| ------------------- | -------------------------------------------------- |
| API not connecting  | Ensure backend is running and `.env` is configured |
| Port already in use | Kill process or change port in `.env`              |
| Styling broken      | Check Bootstrap and MUI imports                    |

---

## 📦 Build for Production

```bash
npm run build
```

Outputs a static build in the `build/` folder.

---




