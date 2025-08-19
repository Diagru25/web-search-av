#!/bin/bash

# Development deployment script with hot reload
set -e

echo "🚀 Starting development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to deploy directory
cd "$(dirname "$0")"

echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down

echo "🚀 Starting development services..."
docker-compose -f docker-compose.dev.yml up -d mongodb

echo "⏳ Waiting for MongoDB to be ready..."
sleep 10

echo "🔧 Starting backend and frontend in development mode..."
echo "📝 Note: Backend and frontend will run on host machine for hot reload"
echo ""
echo "🌐 Services:"
echo "  MongoDB: localhost:27017"
echo "  Backend: localhost:3000 (run 'npm run start:dev' in backend-search/)"
echo "  Frontend: localhost:5173 (run 'npm run dev' in frontend-search/)"
echo ""
echo "🔧 To stop MongoDB: docker-compose -f docker-compose.dev.yml down"
