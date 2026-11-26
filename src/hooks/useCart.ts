



import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

export const cartErr = (e: any) =>
  e?.response?.data?.message || e?.message || "Something went wrong";

export const useCart = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["cart"],
    queryFn: userService.getCart,
    enabled: !!user,
  });
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.addToCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useUpdateCartItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.updateCartItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.removeFromCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};
