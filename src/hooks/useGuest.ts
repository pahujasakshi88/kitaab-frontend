import { useQuery } from "@tanstack/react-query";
import { guestService } from "@/services/guest.service";

export const usePublicBooks = () =>
  useQuery({
    queryKey: ["books", "public"],
    queryFn: guestService.getPublicBooks,
  });

export const usePublicCategories = () =>
  useQuery({
    queryKey: ["categories", "public"],
    queryFn: guestService.getCategories,
  });

export const useBooks = (params: {
  search?: string;
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) => 
  useQuery({
    queryKey: ["books", "browse", params],
    queryFn: () => guestService.getBooks({ ...params, limit: 12 }),
    placeholderData: (prev) => prev,
  });

export const useBook = (id: string) =>
  useQuery({
    queryKey: ["books", "detail", id],
    queryFn: () => guestService.getBookById(id),
    enabled: !!id,
  });
export const useFeaturedBooks = () =>
  useQuery({
    queryKey: ["books", "featured"],
    queryFn: async () => {
      const featured = await guestService.getFeaturedBooks();
      return featured.length > 0 ? featured : guestService.getPublicBooks();
    },
  });
export const useAuthors = () =>
  useQuery({
    queryKey: ["books", "authors"],
    queryFn: guestService.getAuthors,
  });