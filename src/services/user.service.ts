import { http } from "@/lib/api";

export const userService = {
  // Wishlist
  getWishlist: async () => {
    const { data } = await http.get("/api/wishlist");
    return data.wishlist;
  },
  addToWishlist: async (bookId: string) => {
    const { data } = await http.post("/api/wishlist", { bookId });
    return data;
  },
  removeFromWishlist: async (itemId: string) => {
    const { data } = await http.delete(`/api/wishlist/${itemId}`);
    return data;
  },
  clearWishlist: async () => {
    const { data } = await http.delete("/api/wishlist");
    return data;
  },

  // Cart
  getCart: async () => {
    const { data } = await http.get("/api/cart");
    return data;
  },
  addToCart: async (v: { bookId: string; quantity?: number }) => {
    const { data } = await http.post("/api/cart", v);
    return data;
  },
  updateCartItem: async (v: { bookId: string; quantity: number }) => {
    const { data } = await http.patch(`/api/cart/${v.bookId}`, {
      quantity: v.quantity,
    });
    return data;
  },
  removeFromCart: async (bookId: string) => {
    const { data } = await http.delete(`/api/cart/${bookId}`);
    return data;
  },

  // Addresses
  getAddresses: async () => {
    const { data } = await http.get("/api/addresses");
    return data.addresses;
  },
  createAddress: async (body: Record<string, any>) => {
    const { data } = await http.post("/api/addresses", body);
    return data.address;
  },
  deleteAddress: async (id: string) => {
    const { data } = await http.delete(`/api/addresses/${id}`);
    return data;
  },
  // Reading list (My Books)
  getReading: async () => {
    const { data } = await http.get("/api/reading");
    return data.items;
  },
  addToReading: async (bookId: string) => {
    const { data } = await http.post("/api/reading", { bookId });
    return data.item;
  },
  updateReading: async (v: {
    id: string;
    status?: "want" | "reading" | "completed";
    progress?: number;
  }) => {
    const { id, ...body } = v;
    const { data } = await http.patch(`/api/reading/${id}`, body);
    return data.item;
  },
  removeFromReading: async (id: string) => {
    const { data } = await http.delete(`/api/reading/${id}`);
    return data;
  },
  // Orders
  getMyOrders: async (status?: string) => {
    const { data } = await http.get("/api/orders", {
      params: status ? { status } : {},
    });
    return data.orders;
  },
  getMyOrder: async (id: string) => {
    const { data } = await http.get(`/api/orders/${id}`);
    return data.order;
  },
  placeOrder: async (body: {
    addressId: string;
    bookId?: string;
    quantity?: number;
    paymentMethod?: "cod" | "online";
  }) => {
    const { data } = await http.post("/api/orders", {
      paymentMethod: "cod",
      ...body,
    });
    return data; // { order, razorpay? }
  },
  verifyPayment: async (body: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const { data } = await http.post("/api/orders/verify-payment", body);
    return data.order;
  },
  cancelOrder: async (id: string) => {
    const { data } = await http.patch(`/api/orders/${id}/cancel`);
    return data.order;
  },
  // Reviews
  getMyReview: async (bookId: string) => {
    const { data } = await http.get(`/api/reviews/book/${bookId}/mine`);
    return data; // { canReview, review }
  },
  saveReview: async (v: {
    bookId: string;
    rating: number;
    comment: string;
  }) => {
    const { data } = await http.post(`/api/reviews/book/${v.bookId}`, {
      rating: v.rating,
      comment: v.comment,
    });
    return data.review;
  },
  deleteReview: async (id: string) => {
    const { data } = await http.delete(`/api/reviews/${id}`);
    return data;
  },
  getPreferences: async () => {
    const { data } = await http.get("/api/users/preferences");
    return data.preferences as {
      orderUpdates: boolean;
      newBooks: boolean;
      promotions: boolean;
    };
  },
  updatePreferences: async (body: Record<string, boolean>) => {
    const { data } = await http.put("/api/users/preferences", body);
    return data.preferences;
  },
  // Profile
  updateProfile: async (body: { name: string; phone: string }) => {
    const { data } = await http.patch("/api/auth/profile", body);
    return data.user;
  },
  changePassword: async (body: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const { data } = await http.patch("/api/auth/password", body);
    return data;
  },
};
