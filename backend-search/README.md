# Malware Management Backend

Backend quản lý mã độc được xây dựng bằng NestJS và MongoDB với các chức năng:

- Xác thực JWT
- Quản lý mẫu mã độc (CRUD)
- Upload/Download file
- Tìm kiếm và thống kê

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Cấu hình môi trường:
   Tạo file `.env` với nội dung:

```
MONGODB_URI=mongodb://localhost:27017/malware-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
PORT=3000
MAX_FILE_SIZE=50MB
UPLOAD_PATH=./uploads
```

3. Khởi động MongoDB:

```bash
# macOS với Homebrew
brew services start mongodb/brew/mongodb-community

# hoặc Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

4. Tạo user admin đầu tiên:

```bash
npx ts-node scripts/seed-admin.ts
```

5. Khởi động server:

```bash
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký user mới (cần token)
- `GET /api/auth/profile` - Xem thông tin profile
- `POST /api/auth/change-password` - Đổi mật khẩu

### Malware Management

- `GET /api/malware` - Lấy danh sách tất cả mẫu
- `POST /api/malware` - Upload và tạo mẫu mới
- `GET /api/malware/search` - Tìm kiếm mẫu
- `GET /api/malware/statistics` - Thống kê
- `GET /api/malware/:id` - Xem chi tiết mẫu
- `GET /api/malware/:id/download` - Download file mẫu
- `PATCH /api/malware/:id` - Cập nhật thông tin mẫu
- `DELETE /api/malware/:id` - Xóa mẫu

## Schema Database

### User

```javascript
{
  username: String,
  password: String,
  fullName: String,
  department: String,
  isActive: Boolean,
  role: String
}
```

### Malware Sample

```javascript
{
  sampleName: String,
  md5: String,
  collectionUnit: String,
  collectionDate: Date,
  filePath: String,
  description: String,
  fileSize: Number,
  originalName: String
}
```

## Ví dụ sử dụng

### 1. Đăng nhập

```bash
curl -X POST http://localhost:3000/api/auth/login
  -H "Content-Type: application/json"
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Upload mẫu mã độc

```bash
curl -X POST http://localhost:3000/api/malware
  -H "Authorization: Bearer YOUR_TOKEN"
  -F "file=@malware-sample.exe"
  -F "sampleName=Trojan.Win32.Test"
  -F "collectionUnit=Security Team"
  -F "collectionDate=2024-01-01"
  -F "description=Test malware sample"
```

### 3. Tìm kiếm mẫu

```bash
curl "http://localhost:3000/api/malware/search?sampleName=Trojan&fromDate=2024-01-01"
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Download file

```bash
curl -X GET http://localhost:3000/api/malware/SAMPLE_ID/download
  -H "Authorization: Bearer YOUR_TOKEN"
  -o downloaded-sample.exe
```

## Chạy Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Production

Để deploy production:

1. Thay đổi JWT_SECRET trong .env
2. Cấu hình MongoDB Atlas hoặc production database
3. Cấu hình CORS phù hợp
4. Sử dụng PM2 hoặc Docker để chạy

```bash
npm run build
npm run start:prod
```

## Bảo mật

- Tất cả API endpoints (trừ login) đều yêu cầu JWT token
- File upload có giới hạn kích thước
- Validation input với class-validator
- Password được hash với bcrypt
- CORS được cấu hình

## Liên hệ

Để biết thêm thông tin hoặc báo cáo lỗi, vui lòng tạo issue trong repository này.

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
