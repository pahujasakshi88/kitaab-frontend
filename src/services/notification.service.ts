import { http } from "@/lib/api";

export const notificationService = {
  getAll: async () => {
    const { data } = await http.get("/api/notifications");
    return data;
  },
  getUnreadCount: async () => {
    const { data } = await http.get("/api/notifications/unread-count");
    return data.unreadCount as number;
  },
  markRead: async (id: string) => {
    const { data } = await http.patch(`/api/notifications/${id}/read`);
    return data;
  },
  markAllRead: async () => {
    const { data } = await http.patch("/api/notifications/read-all");
    return data;
  },
};
