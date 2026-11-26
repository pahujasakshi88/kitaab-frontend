import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export const useAdminBooks = () =>
  useQuery({ queryKey: ["books", "admin"], queryFn: adminService.getBooks });

export const useSetFeatured = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.setFeatured,
    // "books" se homepage, dashboard aur admin list sab refresh
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
};
