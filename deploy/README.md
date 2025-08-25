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

## Virus File Sync Script

### Overview

The `sync_virus_file.ts` script is designed to automatically import virus/malware files into the database. It follows these steps:

1. **Input Directory**: Prompts user for the directory path containing virus files
2. **Authentication**: Logs in as admin (admin/Admin@123)
3. **Collection Units**: Fetches list of collection units from the API
4. **File Discovery**: Reads all files in the specified directory
5. **Batch Processing**: Creates malware entries with random collection units and dates
6. **Rate Limiting**: Processes files in batches to avoid API overload

### Requirements

- Node.js and npm installed
- Backend API server running
- At least one collection unit in the database
- Directory containing virus/malware files

### Installation

```bash
cd deploy
npm install
```

### Usage

#### Method 1: Using ts-node (Recommended)

```bash
npm run sync
```

#### Method 2: Compile and run

```bash
npm run build
npm start
```

#### Method 3: Direct execution

```bash
npx ts-node sync_virus_file.ts
```

### Configuration

The script uses the following default configuration:

- **API Base URL**: `http://localhost:5000/api`
- **Login Credentials**: `admin/Admin@123`
- **Batch Size**: 5 files per batch
- **Delay Between Batches**: 1000ms (1 second)
- **Date Range**: Random dates from November 2018 to current date

### Features

#### Batch Processing

- Processes files in configurable batches to prevent server overload
- Default batch size: 5 files
- Configurable delay between batches (default: 1 second)

#### Random Data Generation

- **Collection Unit**: Randomly selected from available units
- **Collection Date**: Random date between November 2018 and now
- **Description**: Auto-generated based on filename

#### Error Handling

- Continues processing even if individual files fail
- Provides detailed error reporting
- Shows success/failure statistics at the end

#### File Support

- Accepts all file types (no extension restrictions)
- Handles large files (up to 50MB per file)
- Preserves original filenames

### Example Output

```
Nhập đường dẫn thư mục chứa file mã độc: /path/to/virus/files
Đang đăng nhập...
Đăng nhập thành công!
Đang lấy danh sách đơn vị thu thập...
Đã lấy được 3 đơn vị thu thập
Tìm thấy 15 file trong thư mục

Xử lý batch 1/3 (5 file)
✓ Đã tạo thành công: virus1.exe
✓ Đã tạo thành công: malware2.bin
✓ Đã tạo thành công: trojan3.dll
✗ Lỗi khi tạo sample4.txt: File too large
✓ Đã tạo thành công: worm5.scr
Chờ 1000ms trước khi xử lý batch tiếp theo...

...

=== Kết quả ===
Thành công: 13
Lỗi: 2
Tổng: 15

🎉 Hoàn thành đồng bộ file mã độc!
```

### Troubleshooting

#### Common Issues

1. **Authentication Failed**

   - Ensure the backend server is running
   - Verify admin credentials are correct
   - Check API base URL configuration

2. **No Collection Units Found**

   - Create at least one collection unit in the system before running the script
   - Use the web interface or API to add collection units

3. **File Access Errors**

   - Ensure the directory path exists and is accessible
   - Check file permissions
   - Verify files are not locked by other processes

4. **API Rate Limiting**
   - Increase delay between batches
   - Reduce batch size
   - Check server resource usage

#### Customization

To modify the script behavior, edit the configuration constants in `sync_virus_file.ts`:

```typescript
// Change API endpoint
const API_BASE_URL = "http://your-server:port/api";

// Modify batch processing
await this.processFilesInBatches(virusFiles, 3, 2000); // 3 files per batch, 2 second delay
```

### Security Considerations

- The script uses hardcoded admin credentials for convenience
- In production, consider using environment variables or config files
- Ensure the virus files directory is properly secured
- Monitor API access logs for unusual activity

### Integration with Deployment

This script can be integrated into your deployment workflow:

```bash
# Example deployment with virus sync
./deploy.sh
npm run sync
```
