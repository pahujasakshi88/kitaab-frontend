import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { guestService } from "@/services/guest.service";
import { adminService } from "@/services/admin.service";

export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: guestService.getSettings,
    staleTime: 5 * 60_000,
  });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.updateSettings,
    onSuccess: (data) => qc.setQueryData(["settings"], data),
  });
};
