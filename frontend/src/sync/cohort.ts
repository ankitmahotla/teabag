import { GET_USER_COHORTS } from "@/api/query";
import { useQuery } from "@tanstack/react-query";

export const useGetUserCohortsSync = (userId?: string) => {
  const { data } = useQuery({
    queryKey: ["user-cohorts", userId],
    queryFn: () => GET_USER_COHORTS(userId),
  });

  return { data };
};
