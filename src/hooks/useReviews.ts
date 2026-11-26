import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { guestService } from "@/services/guest.service";
import { userService } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

export const useBookReviews = (bookId: string, page: number) =>
  useQuery({
    queryKey: ["reviews", "list", bookId, page],
    queryFn: () => guestService.getReviews(bookId, page),
    enabled: !!bookId,
    placeholderData: keepPreviousData,
  });

export const useMyReview = (bookId: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reviews", "mine", bookId],
    queryFn: () => userService.getMyReview(bookId),
    enabled: !!bookId && user?.role === "user",
  });
};

const useRefresh = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["reviews"] });
    qc.invalidateQueries({ queryKey: ["books"] }); // book ki rating badli
  };
};

export const useSaveReview = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: userService.saveReview,
    onSuccess: refresh,
  });
};

export const useDeleteReview = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: userService.deleteReview,
    onSuccess: refresh,
  });
};
