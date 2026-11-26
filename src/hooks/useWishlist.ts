import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

export const useWishlist = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: userService.getWishlist,
    enabled: !!user,
  });
};

export const useAddToWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.addToWishlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.removeFromWishlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};
export const useClearWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.clearWishlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};