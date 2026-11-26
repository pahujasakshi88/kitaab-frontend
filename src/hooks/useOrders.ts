import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

export const useMyOrders = (status?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["orders", "list", status || "all"],
    queryFn: () => userService.getMyOrders(status),
    enabled: !!user,
  });
};

export const useMyOrder = (id: string) =>
  useQuery({
    queryKey: ["orders", "detail", id],
    queryFn: () => userService.getMyOrder(id),
    enabled: !!id,
  });

export const usePlaceOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.placeOrder,
    onSuccess: () => {
      // cart khali, stock badla, orders list purani
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.cancelOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
