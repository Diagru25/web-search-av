import axios from "axios";
import { config } from "../config";

// Create axios instance with default config
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    _id: string;
    username: string;
    fullName: string;
    department?: string;
    role?: string;
    isActive: boolean;
  };
}

export interface MalwareSearchRequest {
  sampleName?: string;
  md5?: string;
  collectionUnit?: string;
  fromDate?: string;
  toDate?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

export interface MalwareItem {
  _id: string;
  sampleName: string;
  md5: string;
  collectionUnit: CollectionUnitItem; // Can be populated object or ID string
  collectionDate: string;
  filePath: string;
  description?: string;
  fileSize?: number;
  originalName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMalwareRequest {
  sampleName: string;
  md5?: string;
  collectionUnit: string;
  collectionDate: string;
  description?: string;
  file: File;
}

export interface UpdateMalwareRequest {
  sampleName?: string;
  collectionUnit?: string;
  collectionDate?: string;
  description?: string;
  file?: File;
}

// Collection Unit interfaces
export interface CollectionUnitItem {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionUnitRequest {
  name: string;
  description?: string;
}

export interface UpdateCollectionUnitRequest {
  name?: string;
  description?: string;
} // Auth API calls
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (data: { fullName?: string; department?: string }) => {
    const response = await api.patch("/auth/profile", data);
    return response.data;
  },

  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const response = await api.post("/auth/change-password", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },
};

// Malware API calls
export const malwareAPI = {
  // Lấy danh sách tất cả malware
  getAll: async (pagination: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginatedResponse<MalwareItem>> => {
    const response = await api.get("/malware", { params: pagination });
    return response.data;
  },

  // Tìm kiếm malware
  search: async (
    searchParams: MalwareSearchRequest
  ): Promise<PaginatedResponse<MalwareItem>> => {
    const response = await api.get("/malware/search", { params: searchParams });
    return response.data;
  },

  // Lấy thông tin malware theo ID
  getById: async (id: string): Promise<MalwareItem> => {
    const response = await api.get(`/malware/${id}`);
    return response.data;
  },

  // Tạo malware mới
  create: async (data: CreateMalwareRequest): Promise<MalwareItem> => {
    const formData = new FormData();
    formData.append("sampleName", data.sampleName);
    formData.append("collectionUnit", data.collectionUnit);
    formData.append("collectionDate", data.collectionDate);
    if (data.md5) {
      formData.append("md5", data.md5);
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("file", data.file);

    const response = await api.post("/malware", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Cập nhật malware
  update: async (
    id: string,
    data: UpdateMalwareRequest
  ): Promise<MalwareItem> => {
    const formData = new FormData();

    if (data.sampleName) formData.append("sampleName", data.sampleName);
    if (data.collectionUnit)
      formData.append("collectionUnit", data.collectionUnit);
    if (data.collectionDate)
      formData.append("collectionDate", data.collectionDate);
    if (data.description) formData.append("description", data.description);
    if (data.file) formData.append("file", data.file);

    const response = await api.patch(`/malware/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Xóa malware
  delete: async (id: string): Promise<void> => {
    await api.delete(`/malware/${id}`);
  },

  // Download file malware
  download: async (id: string): Promise<Blob> => {
    const response = await api.get(`/malware/${id}/download`, {
      responseType: "blob",
      timeout: 60000, // 60 seconds timeout
    });
    return response.data;
  },

  // Lấy thống kê
  getStatistics: async () => {
    const response = await api.get("/malware/statistics");
    return response.data;
  },
};

// Collection Unit API calls
export const collectionUnitAPI = {
  // Lấy danh sách tất cả collection units
  getAll: async (): Promise<CollectionUnitItem[]> => {
    const response = await api.get("/collection-units");
    return response.data;
  },

  // Lấy thông tin collection unit theo ID
  getById: async (id: string): Promise<CollectionUnitItem> => {
    const response = await api.get(`/collection-units/${id}`);
    return response.data;
  },

  // Tạo collection unit mới
  create: async (
    data: CreateCollectionUnitRequest
  ): Promise<CollectionUnitItem> => {
    const response = await api.post("/collection-units", data);
    return response.data;
  },

  // Cập nhật collection unit
  update: async (
    id: string,
    data: UpdateCollectionUnitRequest
  ): Promise<CollectionUnitItem> => {
    const response = await api.patch(`/collection-units/${id}`, data);
    return response.data;
  },

  // Xóa collection unit
  delete: async (id: string): Promise<void> => {
    await api.delete(`/collection-units/${id}`);
  },
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
  getTopCollectionUnits: async () => {
    const response = await api.get("/dashboard/top-collection-units");
    return response.data;
  },
  getMalwareByDays: async () => {
    const response = await api.get("/dashboard/malware-by-days");
    return response.data;
  },
};

export default api;
