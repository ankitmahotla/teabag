import { GET_USER_BY_ID } from "@/api/query";
import { useQuery } from "@tanstack/react-query";

export const useGetUserByIdSync = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => GET_USER_BY_ID(userId),
  });
};
