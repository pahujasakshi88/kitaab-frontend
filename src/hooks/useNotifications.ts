import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { useAuth } from "@/context/AuthContext";

export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// Har 30 second mein khud naya check karta hai
export const useNotifications = () => {
  const { user } = useAuth();
  return useQuery<{ notifications: AppNotification[]; unreadCount: number }>({
    queryKey: ["notifications", "list"],
    queryFn: notificationService.getAll,
    enabled: !!user,
    refetchInterval: 30_000,
  });
};

export const useUnreadCount = () => {
  const { user } = useAuth();
  return useQuery<number>({
    queryKey: ["notifications", "unread"],
    queryFn: notificationService.getUnreadCount,
    enabled: !!user,
    refetchInterval: 30_000,
  });
};

export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};
