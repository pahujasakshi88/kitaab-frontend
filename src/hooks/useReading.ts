import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

export const useReading = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reading"],
    queryFn: userService.getReading,
    enabled: !!user,
  });
};

export const useAddToReading = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.addToReading,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reading"] }),
  });
};

export const useUpdateReading = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.updateReading,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reading"] }),
  });
};

export const useRemoveFromReading = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.removeFromReading,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reading"] }),
  });
};
