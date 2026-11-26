import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export interface AdminAnalytics {
  days: 7 | 30 | 90;
  cards: {
    revenue: { value: number; trend: number };
    orders: { value: number; trend: number };
    booksSold: { value: number; trend: number };
    newUsers: { value: number; trend: number };
  };
  revenueBuckets: { from: string; to: string; revenue: number }[];
  popularCategories: { name: string; qty: number }[];
}

export const useAdminAnalytics = (days: 7 | 30 | 90) =>
  useQuery<AdminAnalytics>({
    queryKey: ["admin", "analytics", days],
    queryFn: () => adminService.getAnalytics(days),
    placeholderData: keepPreviousData,
  });
