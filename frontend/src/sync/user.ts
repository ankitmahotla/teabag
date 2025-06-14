import {
  GET_USER_BY_ID,
  GET_USER_INTERACTIONS,
  GET_USER_TEAM_JOINING_REQUESTS_BY_COHORT,
} from "@/api/query";
import { PaginatedInteractionsResponse } from "@/types/user";
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useGetUserByIdSync = (userId: string) => {
  return useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => GET_USER_BY_ID(userId),
  });
};

export const useGetUserTeamJoiningRequestsByCohortSync = (cohortId: string) => {
  const enabled = typeof cohortId === "string" && cohortId.trim() !== "";
  return useQuery({
    queryKey: ["user", "requests", cohortId],
    queryFn: () => GET_USER_TEAM_JOINING_REQUESTS_BY_COHORT(cohortId),
    enabled,
  });
};

export const useGetUserInteractionsPaginated = (userId: string, limit = 10) => {
  const enabled = typeof userId === "string" && userId.trim() !== "";

  return useInfiniteQuery<
    PaginatedInteractionsResponse,
    Error,
    InfiniteData<PaginatedInteractionsResponse>,
    [string, string, string],
    string | undefined
  >({
    queryKey: ["user", "interactions", userId],
    queryFn: ({ pageParam }) => GET_USER_INTERACTIONS(userId, pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled,
  });
};
