#!/bin/bash

# Build and deploy script
set -e

echo "🚀 Starting deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to deploy directory
cd "$(dirname "$0")"

echo "📦 Building images..."

# Build all services
docker-compose build --no-cache

echo "🛑 Stopping existing containers..."
docker-compose down

echo "🗑️  Removing old volumes (optional - comment out if you want to keep data)"
# docker volume rm $(docker volume ls -q) 2>/dev/null || true

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Test services
echo "🧪 Testing services..."
echo "Testing nginx..."
curl -f http://localhost/health || echo "⚠️  Nginx health check failed"

echo "Testing backend..."
curl -f http://localhost/api/health || echo "⚠️  Backend health check failed"

echo "✅ Deployment completed!"
echo "🌐 Application is available at: http://localhost"
echo "📊 MongoDB is available at: localhost:27017"
echo ""
echo "🔧 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop all: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Update: ./deploy.sh"
