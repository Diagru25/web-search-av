# Web Search AV - Malware Management System

Full-stack application for malware file management and analysis with Docker deployment.

## Project Structure

```
web-search-av/
├── backend-search/          # NestJS Backend API
├── frontend-search/         # React + Vite Frontend
├── deploy/                  # Docker deployment configs
│   ├── docker-compose.yml   # Production deployment
│   ├── .env                 # Environment variables
│   ├── Dockerfile.*         # Docker build files
│   └── nginx/              # Nginx reverse proxy config
└── README.md
```

## Technologies

- **Backend:** NestJS, MongoDB, JWT Authentication, Multer file upload
- **Frontend:** React, TypeScript, Vite, Axios
- **Database:** MongoDB with Mongoose ODM
- **Deployment:** Docker, docker-compose, Nginx reverse proxy
- **Authentication:** JWT with bcryptjs password hashing

## Quick Start

### Development
```bash
# Backend
cd backend-search
npm install
npm run start:dev

# Frontend  
cd frontend-search
npm install
npm run dev
```

### Production Deployment
```bash
cd deploy
cp .env.example .env
# Edit .env with your configuration
docker-compose up -d
```

## Features

- **User Management:** Admin authentication and user CRUD
- **Malware Management:** File upload, analysis, and metadata storage
- **Collection Units:** Organizational units for malware categorization
- **File Security:** MD5/SHA1/SHA256 hash verification
- **API Documentation:** RESTful API with proper error handling
- **Responsive UI:** Modern React interface with loading states

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/malware` - List malware files
- `POST /api/malware` - Upload malware file
- `GET /api/collection-units` - List collection units
- `POST /api/collection-units` - Create collection unit

## Environment Variables

Check `deploy/.env.example` for required environment variables.

## Default Credentials

- **Username:** admin
- **Password:** admin123

## License

Private project - All rights reserved.
