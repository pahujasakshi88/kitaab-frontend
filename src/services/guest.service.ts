import { http } from "@/lib/api";

export const guestService = {
  getPublicBooks: async () => {
    const { data } = await http.get("/api/books/public");
    return data.books;
  },

  getFeaturedBooks: async () => {
    const { data } = await http.get("/api/books/public", {
      params: { featured: true },
    });
    return data.books;
  },

  getCategories: async () => {
    const { data } = await http.get("/api/categories");
    return Array.isArray(data) ? data : data.categories || [];
  },

  getBooks: async (params: {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
    author?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const { data } = await http.get("/api/books/browse", { params });
    return data;
  },

  getBookById: async (id: string) => {
    const { data } = await http.get(`/api/books/details/${id}`);
    return data.book;
  },

  getSettings: async () => {
    const { data } = await http.get("/api/settings");
    return data;
  },

  getReviews: async (bookId: string, page = 1) => {
    const { data } = await http.get(`/api/reviews/book/${bookId}`, {
      params: { page },
    });
    return data; // { reviews, summary, pagination }
  },
  getAuthors: async (): Promise<string[]> => {
    const { data } = await http.get("/api/books/authors");
    return data.authors;
  },
};
