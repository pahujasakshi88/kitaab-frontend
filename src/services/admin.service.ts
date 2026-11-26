import { http } from "@/lib/api";

export const adminService = {
  // Dashboard
  getStats: async (days: 7 | 30 = 7) => {
    const { data } = await http.get("/api/admin/stats", { params: { days } });
    return data;
  },

  getAnalytics: async (days: 7 | 30 | 90 = 30) => {
    const { data } = await http.get("/api/admin/analytics", {
      params: { days },
    });
    return data;
  },
  sendPromotion: async (body: {
    title: string;
    message: string;
    link?: string;
  }) => {
    const { data } = await http.post("/api/admin/promotions", body);
    return data as { message: string; sent: number };
  },
  // Categories
  getCategories: async () => {
    const { data } = await http.get("/api/categories/admin");
    return Array.isArray(data) ? data : data.categories || [];
  },
  getCategory: async (id: string) => {
    const { data } = await http.get(`/api/categories/admin/${id}`);
    return data;
  },
  createCategory: async (fd: FormData) => {
    const { data } = await http.post("/api/categories", fd);
    return data;
  },

  updateCategory: async ({ id, fd }: { id: string; fd: FormData }) => {
    const { data } = await http.put(`/api/categories/${id}`, fd);
    return data;
  },

  deleteCategory: async (id: string) => {
    const { data } = await http.delete(`/api/categories/${id}`);
    return data;
  },

  // Orders
  getOrders: async (params: {
    status?: string;
    search?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await http.get("/api/orders/admin/all", {
      params: { limit: 10, ...params },
    });
    return data;
  },

  getOrder: async (id: string) => {
    const { data } = await http.get(`/api/orders/admin/${id}`);
    return data.order;
  },

  updateOrderStatus: async (v: { id: string; status: string }) => {
    const { data } = await http.patch(`/api/orders/admin/${v.id}/status`, {
      status: v.status,
    });
    return data.order;
  },

  // Users
  getUser: async (id: string) => {
    const { data } = await http.get(`/api/admin/users/${id}`);
    return data;
  },
  // Books (featured)
  getBooks: async () => {
    const { data } = await http.get("/api/books");
    return data.books;
  },
  setFeatured: async (v: { id: string; isFeatured: boolean }) => {
    const { data } = await http.patch(`/api/books/${v.id}/featured`, {
      isFeatured: v.isFeatured,
    });
    return data.book;
  },
  updateUserStatus: async (v: { id: string; status: string }) => {
    const { data } = await http.patch(`/api/admin/users/${v.id}/status`, {
      status: v.status,
    });
    return data.user;
  },
  updateSettings: async (body: any) => {
    const { data } = await http.put("/api/settings", body);
    return data;
  },
  getReviews: async (bookId: string, page = 1) => {
    const { data } = await http.get(`/api/reviews/book/${bookId}`, {
      params: { page },
    });
    return data; // { reviews, summary, pagination }
  },
};
