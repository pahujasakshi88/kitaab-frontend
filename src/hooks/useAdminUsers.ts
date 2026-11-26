import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export const useAdminUser = (id: string) =>
  useQuery({
    queryKey: ["users", "admin-detail", id],
    queryFn: () => adminService.getUser(id),
    enabled: !!id,
  });

export const useUpdateUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.updateUserStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
