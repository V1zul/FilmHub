#!/bin/bash

# Script to start both frontend and backend servers

echo "🚀 Starting FilmHub Development Servers..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "server/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd server
  npm install
  cd ..
fi

# Start backend server in background
echo "🔧 Starting backend server on port 3001..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🎬 Starting frontend server on port 3000..."
echo ""
echo "✅ Backend: http://localhost:3001"
echo "✅ Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start frontend
npm start

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

