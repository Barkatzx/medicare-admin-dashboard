// services/api.ts - Full updated file

const API_BASE_URL = "https://medicare-server-production.up.railway.app/api";

export interface User {
  id: string;
  email: string;
  phone_number: string;
  name: string | null;
  pharmacy_name: string | null;
  role: "admin" | "customer";
  isApproved: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  discountPercent: number;
  stock: number;
  categoryId: string;
  createdAt: string;
  updatedAt?: string;
  images?: ProductImage[];
  category?: Category;
  finalPrice?: number;
  savings?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  productId: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone_number: string;
  };
  items: OrderItem[];
  payment: Payment;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  product: Product;
}

export interface Payment {
  id: string;
  status: string;
  method: string;
  paidAt: string | null;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  totalProducts: number;
}

// Add after SalesSummary interface
export interface DashboardData {
  today: {
    sales: number;
    orders: number;
    items: number;
  };
  this_week: {
    sales: number;
    orders: number;
    items: number;
  };
  this_month: {
    sales: number;
    orders: number;
    items: number;
  };
  this_year: {
    sales: number;
    orders: number;
    items: number;
  };
  lifetime: {
    sales: number;
    orders: number;
    customers: number;
    products_sold: number;
  };
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  recent_orders: Order[];
}

class API {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token =
        localStorage.getItem("adminToken") || localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("adminToken", token);
      localStorage.setItem("token", token); // Keep both for compatibility
    }
  }

  getToken() {
    if (!this.token && typeof window !== "undefined") {
      // Try both keys
      this.token =
        localStorage.getItem("adminToken") || localStorage.getItem("token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    this.user = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  setUser(user: User) {
    this.user = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  getUser() {
    if (!this.user && typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }
    }
    return this.user;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "API request failed" }));
        throw new Error(error.message || "API request failed");
      }

      const result = await response.json();

      // Handle Railway API response structure { success: true, data: ... }
      if (result && result.success === true) {
        return result.data;
      }

      return result;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ==================== AUTH ====================
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    if (!result.data) {
      throw new Error("Invalid response from server");
    }

    const { token, user } = result.data;

    if (user.role !== "admin") {
      throw new Error("Access denied. Admin only.");
    }

    if (!user.isApproved) {
      throw new Error(
        "Account pending approval. Please wait for admin approval.",
      );
    }

    this.setToken(token);
    this.setUser(user);

    return { token, user };
  }

  // ==================== USER MANAGEMENT ====================
  async getUsers(): Promise<User[]> {
    const response = await this.request("/users/all");
    // Handle the response structure: { message, data: { users, pagination } }
    if (response && response.data && Array.isArray(response.data.users)) {
      return response.data.users;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  }

  async approveUser(userId: string): Promise<User> {
    return this.request(`/users/approve/${userId}`, { method: "PUT" });
  }

  // ==================== PRODUCT MANAGEMENT ====================
  async getAllProducts(): Promise<Product[]> {
    const result = await this.request("/products/");
    if (result && result.products && Array.isArray(result.products)) {
      return result.products;
    }
    if (Array.isArray(result)) {
      return result;
    }
    return [];
  }

  async getProductById(id: string): Promise<Product> {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create product");
    }

    return result.data;
  }

  async updateProduct(
    productId: string,
    productData: Partial<Product>,
  ): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update product");
    }

    return result.data;
  }

  async deleteProduct(productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete product");
    }
  }

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const result = await this.request(
      `/products/admin/low-stock?threshold=${threshold}`,
    );
    if (result && result.products && Array.isArray(result.products)) {
      return result.products;
    }
    if (Array.isArray(result)) {
      return result;
    }
    return [];
  }

  async addProductImages(productId: string, images: File[]): Promise<any> {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    const token = this.getToken();
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to upload images");
    }

    return result.data;
  }

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete product image");
    }
  }

  async incrementProductStock(
    productId: string,
    stock: number,
  ): Promise<Product> {
    return this.request(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ operation: "increment", stock }),
    });
  }

  async decrementProductStock(
    productId: string,
    stock: number,
  ): Promise<Product> {
    return this.request(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ operation: "decrement", stock }),
    });
  }

  async updateProductStock(productId: string, stock: number): Promise<Product> {
    return this.request(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ stock }),
    });
  }

  // ==================== CATEGORY MANAGEMENT ====================
  async getAllCategories(): Promise<Category[]> {
    const result = await this.request("/categories/");
    if (result && result.categories && Array.isArray(result.categories)) {
      return result.categories;
    }
    if (Array.isArray(result)) {
      return result;
    }
    return [];
  }

  async createCategory(name: string, description?: string): Promise<Category> {
    return this.request("/categories/", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  }

  // ==================== ORDER MANAGEMENT ====================
  async getAllOrders(
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<{ orders: Order[]; pagination: any }> {
    let url = `/orders?page=${page}&limit=${limit}`;
    if (status && status !== "all") {
      url += `&status=${status}`;
    }
    const data = await this.request(url);
    return {
      orders: data?.orders || [],
      pagination: data?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
      },
    };
  }

  async getOrderById(orderId: string): Promise<Order> {
    return this.request(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.request(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async confirmPayment(orderId: string): Promise<Payment> {
    return this.request(`/orders/${orderId}/payment/confirm`, {
      method: "PUT",
    });
  }

  // ==================== SALES & REPORTS ====================
  async getSalesSummary(): Promise<SalesSummary> {
    return this.request("/sales/summary");
  }

  async getTopProducts(limit: number = 10): Promise<any[]> {
    const data = await this.request(`/sales/top-products?limit=${limit}`);
    return Array.isArray(data) ? data : [];
  }

  async getDashboardData(): Promise<DashboardData> {
    const data = await this.request("/sales/dashboard");
    return data as DashboardData;
  }

  async getDailySales(): Promise<any[]> {
    const data = await this.request("/sales/daily");
    return Array.isArray(data) ? data : [];
  }

  async getWeeklySales(): Promise<any[]> {
    const data = await this.request("/sales/weekly");
    return Array.isArray(data) ? data : [];
  }

  async getMonthlySales(): Promise<any[]> {
    const data = await this.request("/sales/monthly");
    return Array.isArray(data) ? data : [];
  }

  async exportSalesData(format: "csv" | "pdf" = "csv") {
    const token = this.getToken();
    const response = await fetch(
      `${API_BASE_URL}/sales/export?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (format === "csv") {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales-data-${new Date().toISOString()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }

    return response;
  }
}

export const api = new API();
