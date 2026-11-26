import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

export const useAddresses = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["addresses"],
    queryFn: userService.getAddresses,
    enabled: !!user,
  });
};

export const useCreateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.createAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};
