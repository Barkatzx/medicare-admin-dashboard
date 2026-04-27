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

export interface ShippingAddress {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  shippingAddress?: ShippingAddress;
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

  private async request(
    endpoint: string,
    options: RequestInit = {},
    retries = 3,
    backoff = 300,
  ): Promise<any> {
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
        // Retry on 5xx server errors
        if (response.status >= 500 && retries > 0) {
          console.warn(
            `API ${response.status} for ${endpoint}. Retrying in ${backoff}ms...`,
          );
          await new Promise((resolve) => setTimeout(resolve, backoff));
          return this.request(endpoint, options, retries - 1, backoff * 2);
        }

        const text = await response.text();
        console.error(
          `API Error details: ${response.status} ${response.statusText}`,
          text,
        );
        let error;
        try {
          error = JSON.parse(text);
        } catch (e) {
          error = {
            message: `API request failed with status ${response.status}`,
          };
        }
        throw new Error(
          error.message ||
            error.error ||
            `API request failed with status ${response.status}`,
        );
      }

      const result = await response.json();

      // Handle Railway API response structure { success: true, data: ... }
      if (result && result.success === true) {
        return result.data;
      }

      return result;
    } catch (error) {
      // Retry on network errors (fetch throws TypeError)
      if (retries > 0 && error instanceof TypeError) {
        console.warn(
          `Network error for ${endpoint}. Retrying in ${backoff}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return this.request(endpoint, options, retries - 1, backoff * 2);
      }

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

  // ==================== USER ADDRESS NOTIFICATION MANAGEMENT ====================

  async getProfile(): Promise<any> {
    const response = await this.request("/users/profile");
    return response?.data ?? response;
  }

  async getAddresses(): Promise<any[]> {
    const response = await this.request("/users/addresses");
    const data = response?.data ?? response;
    return Array.isArray(data) ? data : [];
  }

  async getNotifications(unreadOnly: boolean = false): Promise<any> {
    const url = unreadOnly
      ? "/users/notifications?unreadOnly=true"
      : "/users/notifications";
    const response = await this.request(url);
    // response.data = { notifications, unreadCount, pagination }
    return response?.data ?? response;
  }

  async updateProfile(profileData: {
    name: string;
    pharmacy_name: string;
    phone_number: string;
  }): Promise<any> {
    const response = await this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    return response?.data ?? response;
  }

  async changePassword(passwordData: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
    return this.request("/users/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });
  }

  async createAddress(addressData: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }): Promise<any> {
    const response = await this.request("/users/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
    return response?.data ?? response;
  }

  async updateAddress(
    addressId: string,
    addressData: Partial<{
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isDefault: boolean;
    }>,
  ): Promise<any> {
    const response = await this.request(`/users/addresses/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    });
    return response?.data ?? response;
  }

  async deleteAddress(addressId: string): Promise<void> {
    return this.request(`/users/addresses/${addressId}`, {
      method: "DELETE",
    });
  }

  async setDefaultAddress(addressId: string): Promise<any> {
    const response = await this.request(`/users/addresses/${addressId}`, {
      method: "PUT",
      body: JSON.stringify({ isDefault: true }),
    });
    return response?.data ?? response;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    return this.request(`/users/notifications/${notificationId}`, {
      method: "PUT",
    });
  }

  async markAllNotificationsAsRead(): Promise<void> {
    return this.request("/users/notifications/read-all", {
      method: "PUT",
    });
  }

  async sendNotification(payload: {
    userId: string;
    title: string;
    message: string;
    type: string;
  }): Promise<any> {
    const adminToken = localStorage.getItem("adminToken");
    const response = await this.request("/users/notifications/send", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
    });
    return response?.data ?? response;
  }

  async sendBulkNotifications(payload: {
    userIds: string[];
    title: string;
    message: string;
    type: string;
  }): Promise<any> {
    const adminToken = localStorage.getItem("adminToken");
    const response = await this.request("/users/notifications/send-bulk", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
    });
    return response?.data ?? response;
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
    return this.request("/products/", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(
    productId: string,
    productData: Partial<Product>,
  ): Promise<Product> {
    return this.request(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.request(`/products/${productId}/`, {
      method: "DELETE",
    });
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

  // Replace the stock management methods in API class with these:

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

  async updateCategory(
    id: string,
    name: string,
    description?: string,
  ): Promise<Category> {
    return this.request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, description }),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request(`/categories/${id}`, {
      method: "DELETE",
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

  async confirmPayment(
    orderId: string,
  ): Promise<{ orderId: string; payment: Payment }> {
    const response = await this.request(`/orders/${orderId}/payment/confirm`, {
      method: "PUT",
    });
    // Return an object that includes the orderId
    return { orderId, payment: response };
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
