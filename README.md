<div align="center">
  <h1>Orbit Cloud IDE 🚀</h1>
  <p>A modern, collaborative, cloud-based integrated development environment.</p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  </p>
</div>

## 📖 Overview

**Orbit Cloud IDE** is a full-stack, cloud-based Integrated Development Environment (IDE) that enables developers to write, execute, and collaborate on code directly from their browser. Built with a modern tech stack, it features a powerful code editor, an integrated terminal, real-time collaboration, and secure authentication.



## ✨ Features

- **Advanced Code Editor:** Integrated [Monaco Editor](https://microsoft.github.io/monaco-editor/) (the engine behind VS Code) for a rich coding experience.
- **Real-Time Collaboration:** Code together with peers simultaneously, powered by [Yjs](https://yjs.dev/) and WebSockets.
- **Integrated Terminal:** Full-featured in-browser terminal powered by [Xterm.js](https://xtermjs.org/).
- **Secure Authentication:** JWT-based authentication along with OAuth (Google, GitHub) via [Passport.js](https://www.passportjs.org/).
- **File Management:** Organize and manage your projects seamlessly.
- **Media Management:** Profile pictures and media stored securely using [Cloudinary](https://cloudinary.com/).
- **Modern UI:** Responsive, beautiful interface built with React, Tailwind CSS, and Redux Toolkit.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **State Management:** Redux Toolkit
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **Terminal:** Xterm.js
- **Collaboration:** Yjs, `y-websocket`
- **Real-time:** Socket.io-client

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.io, `y-websocket`
- **Authentication:** Passport.js (Google/GitHub OAuth), JWT
- **Email:** Nodemailer
- **Storage:** Cloudinary

## 🏗️ Architecture & Diagrams

The architecture is built on a client-server model utilizing REST APIs for state and standard operations, alongside WebSockets for real-time collaborative editing and terminal sessions.


*(Additional diagram files such as `er_diagram.png` and `auth_flow.mmd` are included in the root directory for deeper architectural insights)*

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account
- Google/GitHub OAuth credentials (optional, for OAuth login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Cloud Ide"
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```bash
     cp .env.example .env
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`.

## ⚙️ Environment Variables

The backend requires several environment variables to run properly. Please refer to `backend/.env.example` for the full list of required variables, including:
- `MONGO_URI`
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
- OAuth Credentials (`GOOGLE_CLIENT_ID`, `GITHUB_CLIENT_ID`, etc.)
- `SMTP_HOST` / `SMTP_USER` (for emails)
- Cloudinary API Keys

## 📜 Scripts

### Backend (`/backend`)
- `npm run start` - Starts the production server
- `npm run dev` - Starts the development server using nodemon
- `npm run lint` - Lints the codebase
- `npm run test` - Runs Jest tests

### Frontend (`/frontend`)
- `npm run dev` - Starts Vite dev server
- `npm run build` - Builds for production
- `npm run lint` - Lints the codebase using Oxlint
- `npm run preview` - Previews the production build

## 📄 License

This project is licensed under the MIT License.
