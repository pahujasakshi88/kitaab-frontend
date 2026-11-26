import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export const errMsg = (e: any) =>
  e?.response?.data?.message || e?.message || "Something went wrong";

export const useAdminCategories = () =>
  useQuery({
    queryKey: ["categories", "admin"],
    queryFn: adminService.getCategories,
  });

export const useAdminCategory = (id: string) =>
  useQuery({
    queryKey: ["categories", "admin-detail", id],
    queryFn: () => adminService.getCategory(id),
    enabled: !!id,
  });

export const useSaveCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id?: string; fd: FormData }) =>
      v.id
        ? adminService.updateCategory({ id: v.id, fd: v.fd })
        : adminService.createCategory(v.fd),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};
