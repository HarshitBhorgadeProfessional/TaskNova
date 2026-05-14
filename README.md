# Team Task Manager

A full-stack collaborative task and project management platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features
- **JWT Authentication** (Signup/Login/Logout).
- **Role-Based Access Control (RBAC)**: Admin and Member roles.
- **Project Management**: Admins can create and manage projects and teams.
- **Task Management**: Create, assign, update, and track tasks.
- **Dashboard**: Visual analytics (using Recharts).
- **Responsive UI**: Built with Tailwind CSS and React Router.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, Recharts, React Router
- **Backend**: Node.js, Express, MongoDB (Mongoose), bcryptjs, jsonwebtoken
- **Deployment Ready**: Railway, Vercel, or Render

## Installation & Local Setup

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd TeamTaskManager
\`\`\`

### 2. Install Dependencies
Navigate to both backend and frontend directories and install dependencies.
\`\`\`bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env\` file in the **backend** folder:
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team_task_manager
JWT_SECRET=your_super_secret_key
NODE_ENV=development
\`\`\`

Create a \`.env\` file in the **frontend** folder:
\`\`\`
VITE_API_URL=http://localhost:5000
\`\`\`

### 4. Run the Application
You can run both servers concurrently from the root directory:
\`\`\`bash
npm run dev
\`\`\`
- Frontend runs at \`http://localhost:3000\`
- Backend runs at \`http://localhost:5000\`

## Deployment to Railway
1. Push your code to a GitHub repository.
2. Connect your repo to Railway.
3. Add a MongoDB database service in Railway.
4. Add the \`MONGODB_URI\` and \`JWT_SECRET\` environment variables to your application service.
5. Railway will automatically detect the \`railway.toml\` file, build the frontend, and start the Node backend.

*Note: For serving the frontend from the Node backend in production, make sure to add static file serving logic to \`server.js\` if you plan to host both on a single Railway service, or deploy Frontend to Vercel and Backend to Railway.*
