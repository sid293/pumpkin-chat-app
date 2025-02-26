# Real-Time Chat Messaging Application

A modern real-time chat application built with React and Node.js, enabling instant messaging capabilities through WebSocket connections.

## Tech Stack

### Frontend
- React 19
- React Router DOM 7
- Socket.IO Client
- Vite (Build Tool)

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (with Mongoose)
- CORS

## Features
- Real-time messaging
- User authentication
- Modern responsive UI
- WebSocket-based communication

## Prerequisites
- Node.js (Latest LTS version)
- MongoDB installed and running locally
- npm or yarn package manager

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with necessary environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file if required
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development
- Backend runs on `http://localhost:3000` by default
- Frontend development server runs on `http://localhost:5173` with Vite
- Use `npm run build` in the frontend directory to create a production build

## Project Structure
```
├── backend/
│   ├── src/
│   │   ├── index.js         # Main server file
│   │   ├── models/          # Database models
│   │   └── socket/          # Socket.IO handlers
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API services
    │   ├── App.jsx          # Main App component
    │   └── main.jsx         # Entry point
    └── package.json
```# pumpkin-chat-app
