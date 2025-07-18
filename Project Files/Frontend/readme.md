# 🌐 Doctor Appointment Booking App – Frontend

This is the **frontend** for the Doctor Appointment Booking System. It is built with **React** and **TypeScript**, using modern libraries like Redux Toolkit and MUI for state management and UI.

---

## 📦 1. Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)
- Git (for cloning the repository)

---

## 🔁 2. Clone the Repository

If you haven't cloned the project yet:

```bash
git clone <your-repo-url>
cd Doctors\ Appointment/frontend
````

---

## 📥 3. Install Dependencies

Run the following command to install all required npm packages:

```bash
npm install
```

---

## ⚙️ 4. Environment Variables

If your frontend needs to communicate with a backend API, create a `.env` file in the root of the `frontend/` directory.

Here is an example `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

| Variable            | Description                    |
| ------------------- | ------------------------------ |
| `REACT_APP_API_URL` | URL of your backend API server |

> ⚠️ Ensure this URL matches your backend URL and port.

---

## 🚀 5. Run the Development Server

To start the app locally in development mode:

```bash
npm start
```

* Opens in your browser at: [http://localhost:3000](http://localhost:3000)
* Supports hot reloading for rapid development

---

## 🏗 6. Build for Production

To create an optimized production-ready version of the app:

```bash
npm run build
```

* Output will be in the `build/` folder
* Deploy the contents of `build/` to your preferred hosting provider (e.g., Netlify, Vercel)

---

## 🧾 7. Project Structure

```
frontend/
├── public/             # Static files (index.html, favicon, etc.)
├── src/
│   ├── assets/         # Images and other static files
│   ├── components/     # Reusable UI components
│   ├── redux/          # Redux Toolkit store and slices
│   ├── routes/         # React Router route definitions
│   ├── utils/          # Utility functions
│   ├── views/          # Page-level React components
│   └── App.tsx         # Root component
```

---

## ❗ 8. Troubleshooting

| Problem                      | Solution                                          |
| ---------------------------- | ------------------------------------------------- |
| Port already in use          | Set a different `PORT=xxxx` in your `.env` file   |
| API not connecting           | Verify `REACT_APP_API_URL` and backend is running |
| Module not found             | Run `npm install` again                           |
| Environment vars not loading | Ensure `.env` exists in the root folder           |

---

## 🛠 9. Useful Scripts

| Script          | Description                    |
| --------------- | ------------------------------ |
| `npm start`     | Start development server       |
| `npm run build` | Create production build        |
| `npm test`      | Run unit tests (if configured) |



