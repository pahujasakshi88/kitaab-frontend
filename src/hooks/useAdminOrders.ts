import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export const useAdminOrders = (params: {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["orders", "admin", params],
    queryFn: () => adminService.getOrders(params),
    placeholderData: keepPreviousData,
  });

export const useAdminOrder = (id: string) =>
  useQuery({
    queryKey: ["orders", "admin-detail", id],
    queryFn: () => adminService.getOrder(id),
    enabled: !!id,
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.updateOrderStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] }); // admin aur user dono ki lists
      qc.invalidateQueries({ queryKey: ["books"] }); // cancel par stock wapas
    },
  });
};
