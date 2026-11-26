import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export interface AdminStats {
  users: number;
  books: number;
  categories: number;
  orders: number;
  revenue: number;
  days: 7 | 30;
  salesByDay: { date: string; sales: number; orders: number }[];
  topSelling: {
    _id: string;
    title: string;
    author: string;
    image?: string;
    sold: number;
  }[];
  lowStock: {
    _id: string;
    title: string;
    author: string;
    stock: number;
    image?: string;
  }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
  }[];
  recentOrders: {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user?: { name: string } | null;
  }[];
  trends: { users: number; books: number; orders: number; revenue: number };
}

export const useAdminStats = (days: 7 | 30) =>
  useQuery<AdminStats>({
    queryKey: ["admin", "stats", days],
    queryFn: () => adminService.getStats(days),
    placeholderData: keepPreviousData,
  });
