# Web Search Application - Docker Deployment

Hướng dẫn triển khai ứng dụng Web Search với Docker.

## Cấu trúc

```
deploy/
├── docker-compose.yml          # Production deployment
├── docker-compose.dev.yml     # Development deployment
├── Dockerfile.backend          # Backend Docker image
├── Dockerfile.frontend         # Frontend Docker image
├── Dockerfile.nginx           # Nginx reverse proxy
├── nginx/
│   ├── nginx.conf             # Main nginx config
│   ├── default.conf           # Reverse proxy config
│   └── frontend.conf          # Frontend nginx config
├── mongo-init.js              # MongoDB initialization
├── .env.production           # Production environment variables
├── deploy.sh                 # Production deployment script
├── dev-deploy.sh            # Development deployment script
└── README.md                # This file
```

## Triển khai Production

### 1. Chuẩn bị

```bash
cd deploy
```

### 2. Cấu hình môi trường

Chỉnh sửa file `.env.production` với các thông tin phù hợp:

```bash
# Thay đổi JWT secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cấu hình CORS
CORS_ORIGIN=http://your-domain.com
```

### 3. Triển khai

```bash
./deploy.sh
```

### 4. Truy cập ứng dụng

- **Frontend**: http://localhost
- **API**: http://localhost/api
- **MongoDB**: localhost:27017

## Triển khai Development

Chỉ chạy MongoDB trong Docker, backend và frontend chạy trên host để có hot reload:

```bash
./dev-deploy.sh
```

Sau đó chạy backend và frontend riêng biệt:

```bash
# Terminal 1 - Backend
cd ../backend-search
npm install
npm run start:dev

# Terminal 2 - Frontend
cd ../frontend-search
npm install
npm run dev
```

## Quản lý

### Xem logs

```bash
docker-compose logs -f
docker-compose logs -f backend  # Chỉ backend
docker-compose logs -f frontend # Chỉ frontend
```

### Dừng services

```bash
docker-compose down
```

### Restart services

```bash
docker-compose restart
docker-compose restart backend  # Chỉ restart backend
```

### Rebuild và restart

```bash
docker-compose up -d --build
```

### Xóa tất cả (bao gồm data)

```bash
docker-compose down -v
docker system prune -f
```

## Cấu hình MongoDB

- **Username**: admin
- **Password**: password123
- **Database**: websearch
- **Port**: 27017

### Kết nối từ bên ngoài

```bash
mongo mongodb://admin:password123@localhost:27017/websearch?authSource=admin
```

## Nginx Configuration

### Reverse Proxy Routes

- `/` → Frontend (React app)
- `/api/` → Backend (NestJS API)
- `/api/auth/` → Backend auth với rate limiting nghiêm ngặt
- `/api/uploads/` → Backend file uploads

### Security Features

- Rate limiting
- Security headers
- File upload size limits
- CORS configuration
- Gzip compression

## Troubleshooting

### Backend không khởi động

1. Kiểm tra MongoDB đã sẵn sàng:

```bash
docker-compose logs mongodb
```

2. Kiểm tra environment variables:

```bash
docker-compose exec backend env
```

### Frontend không load

1. Kiểm tra nginx logs:

```bash
docker-compose logs nginx
```

2. Kiểm tra frontend build:

```bash
docker-compose exec frontend ls -la /usr/share/nginx/html
```

### Database connection issues

1. Kiểm tra MongoDB connection:

```bash
docker-compose exec backend nc -zv mongodb 27017
```

2. Kiểm tra MongoDB logs:

```bash
docker-compose logs mongodb
```

## Production Considerations

### Security

1. Thay đổi mật khẩu MongoDB mặc định
2. Cấu hình SSL/TLS certificates
3. Thiết lập firewall rules
4. Cập nhật JWT secret
5. Cấu hình proper CORS origins

### Performance

1. Tăng MongoDB memory limits
2. Cấu hình MongoDB replica set cho high availability
3. Thiết lập Redis cache nếu cần
4. Cấu hình CDN cho static assets

### Monitoring

1. Thiết lập health checks
2. Cấu hình logging aggregation
3. Monitoring metrics (CPU, memory, disk)
4. Backup strategy cho MongoDB

### Backup

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/websearch?authSource=admin" --out=/tmp/backup

# Restore MongoDB
docker-compose exec mongodb mongorestore --uri="mongodb://admin:password123@localhost:27017/websearch?authSource=admin" /tmp/backup/websearch
```
