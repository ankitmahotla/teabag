import { CREATE_TEAM } from "@/api/mutation";
import { GET_COHORT_TEAMS, GET_TEAM_BY_ID } from "@/api/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "./client";

export const useGetCohortTeamsSync = (cohortId: string) => {
  const isEnabled = Boolean(cohortId);
  return useQuery({
    queryKey: ["teams", cohortId],
    queryFn: () => GET_COHORT_TEAMS(cohortId),
    enabled: isEnabled,
  });
};

export const useGetTeamByIdSync = (teamId: string) => {
  const isEnabled = Boolean(teamId);
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => GET_TEAM_BY_ID(teamId),
    enabled: isEnabled,
  });
};

export const useCreateTeamSync = () => {
  return useMutation({
    mutationFn: CREATE_TEAM,
    onSuccess: () => {
      toast.success("Team created successfully");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
