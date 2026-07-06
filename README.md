# Full-Stack ToDo Application

A modern, responsive, full-stack ToDo application built with React, Node.js, Express, and MongoDB. The application features a clean user interface with features like task creation, editing, status toggling, and deletion.

## 🚀 Features

- **Full CRUD Functionality**: Create, read, update, and delete tasks.
- **Task Categorization/Priority**: Support for managing tasks efficiently.
- **Responsive Design**: Mobile-friendly layout using custom CSS.
- **Full-stack Architecture**: React SPA frontend powered by an Express REST API backend.
- **Production-ready Routing**: Express routes using MongoDB.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React (v19)
  - Vite
  - Lucide React (for icons)
  - Axios (for API requests)
  - Vanilla CSS
- **Backend**:
  - Node.js & Express
  - MongoDB & Mongoose
  - Cors & Dotenv
- **Tooling**:
  - Concurrently (runs frontend & backend in a single terminal command)

---

## 📁 Project Structure

```
ToDo/
├── package.json              # Root package.json (scripts to run dev and install)
├── .gitignore                # Root gitignore
├── todo-app/
│   ├── client/               # React frontend (Vite)
│   │   ├── src/              # Application source
│   │   └── package.json
│   └── server/               # Express backend
│       ├── config/           # Database configuration
│       ├── models/           # Mongoose models
│       ├── routes/           # Express routes
│       ├── server.js         # Entry point
│       └── package.json
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ToDo
   ```

2. **Install all dependencies** (installs root, client, and server dependencies):
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside `todo-app/server/` and configure:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run in Development Mode**:
   Start both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   - Frontend will run on: `http://localhost:5173`
   - Backend will run on: `http://localhost:5000`

---

## 📄 License

This project is open-source and available under the MIT License.
