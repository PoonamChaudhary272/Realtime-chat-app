<h2>Introduction</h2>
<p>A real-time chat application built with the MERN stack, enhanced with Socket.IO for instant communication, JWT for secure authentication, Zustand for state management, and styled using Tailwind CSS. Powered by Vite for a fast frontend dev experience and TypeScript for type safety.</p>
<h2>Tech Stack</h2>
Frontend:

React 18

TypeScript

React Router DOM

Zustand (state management)

Tailwind CSS

Lucide React (icons)

Vite (bundler)
Backend:

Node.js

Express.js

MongoDB with Mongoose

Socket.IO

JSON Web Token (JWT)

bcryptjs (password hashing)

dotenv (env management)

CORS

Dev Tools:

ESLint with TypeScript & React plugins

Nodemon for live backend reloads

PostCSS & Autoprefixer

Vite build system

<h2>Features</h2>
Real-time 1-on-1 and group chat via Socket.IO

✅ Secure authentication using JWT

✅ Password hashing with bcryptjs

✅ Responsive UI with Tailwind CSS

✅ Modular file structure with Zustand for state

✅ TypeScript across frontend and backend

✅ Fast dev experience with Vite

✅ REST API built using Express
<h2>Folder Structure</h2>

```bash

project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   ├── config.ts
│   └── index.css
├── server/
│   └── index.js
├── .env
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json

```

<h2> Getting Started</h2>
Clone the repository

```bash
git clone https://github.com/PoonamChaudhary272/mern-chat-app.git
cd mern-chat-app

```

<h2> Install dependencies</h2>

```bash
npm install
```

<h2>Setup environment variables</h2>

```bash
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

```
<h2>Run the app</h2>
Frontend 

```bash
npm run dev
```
Backend

```bash
npm run dev:server
```

Visit the app at: http://localhost:5174
![Screenshot 2025-05-20 124226](https://github.com/user-attachments/assets/378c378b-8533-427a-b647-3c057bf248d2)
![Screenshot 2025-05-20 124226](https://github.com/user-attachments/assets/879b1708-f3a2-4a26-a0cd-e19415e3d26f)
![Screenshot 2025-05-20 221508](https://github.com/user-attachments/assets/b3f3baf0-d41a-46e0-8026-246051e25689)
![Screenshot 2025-05-20 221718](https://github.com/user-attachments/assets/81f45b73-8794-43df-82a0-8f1354065be9)



