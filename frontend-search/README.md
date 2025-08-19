# Frontend Search Malware

Frontend application để tìm kiếm và quản lý thông tin mã độc, được xây dựng bằng React, TypeScript, Vite và Ant Design.

## Tính năng

- 🔐 **Đăng nhập an toàn** với JWT authentication
- 🔍 **Tìm kiếm mã độc** theo tên, hash hoặc family
- 📱 **Giao diện responsive** với Ant Design
- 🚀 **Performance cao** với Vite
- 🎯 **TypeScript** cho type safety

## Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Backend API đang chạy trên port 5000

## Cài đặt

1. Clone repository

```bash
git clone <repository-url>
cd frontend-search
```

2. Cài đặt dependencies

```bash
npm install
```

3. Cấu hình environment

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` theo cấu hình của bạn:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Chạy ứng dụng

### Development

```bash
npm run dev
```

Ứng dụng sẽ chạy trên http://localhost:5173

### Build cho production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Cấu trúc project

```
src/
├── components/          # Shared components
│   └── LoadingScreen.tsx
├── config/             # Configuration files
│   └── index.ts
├── pages/              # Page components
│   ├── Login.tsx
│   └── MalwareSearch.tsx
├── services/           # API services
│   └── api.ts
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## API Integration

Frontend này được thiết kế để làm việc với backend NestJS có các endpoint sau:

- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin user
- `GET /api/malware/search` - Tìm kiếm mã độc

## Chức năng chính

### 1. Đăng nhập

- Form đăng nhập với validation
- Lưu JWT token vào localStorage
- Auto-login khi có token hợp lệ

### 2. Tìm kiếm mã độc

- Tìm kiếm theo tên, hash hoặc family
- Phân trang kết quả
- Hiển thị thông tin chi tiết mỗi mã độc

### 3. Quản lý session

- Auto logout khi token hết hạn
- Protected routes

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:5000/api  # Backend API URL
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server
- **Ant Design** - UI component library
- **Axios** - HTTP client
- **React Router** - Routing

        // Remove tseslint.configs.recommended and replace with this
        ...tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        ...tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        ...tseslint.configs.stylisticTypeChecked,

        // Other configs...
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
        // other options...
      },

  }, ])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
