import {
  GET_USER_BY_ID,
  GET_USER_TEAM_JOINING_REQUESTS_BY_COHORT,
} from "@/api/query";
import { useQuery } from "@tanstack/react-query";

export const useGetUserByIdSync = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => GET_USER_BY_ID(userId),
  });
};

export const useGetUserTeamJoiningRequestsByCohortSync = (cohortId: string) => {
  return useQuery({
    queryKey: ["user", "requests", cohortId],
    queryFn: () => GET_USER_TEAM_JOINING_REQUESTS_BY_COHORT(cohortId),
  });
};
