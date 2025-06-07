import {
  CREATE_TEAM,
  DISBAND_TEAM,
  REQUEST_TEAM_JOIN,
  TOGGLE_PUBLISH_TEAM,
  UPDATE_TEAM_JOIN_REQUEST_STATUS,
  WITHDRAW_TEAM_JOIN_REQUEST,
} from "@/api/mutation";
import {
  GET_COHORT_TEAMS,
  GET_PENDING_TEAM_JOIN_REQUESTS,
  GET_TEAM_BY_ID,
  GET_TEAM_REQUEST_STATUS,
  GET_USER_TEAM_BY_COHORT,
} from "@/api/query";
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
      queryClient.invalidateQueries({ queryKey: ["teams", "team"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetUserTeamByCohortSync = (cohortId: string) => {
  const isEnabled = Boolean(cohortId);
  return useQuery({
    queryKey: ["userTeam", cohortId],
    queryFn: () => GET_USER_TEAM_BY_COHORT(cohortId),
    enabled: isEnabled,
  });
};

export const useTogglePublishTeamSync = () => {
  return useMutation({
    mutationFn: TOGGLE_PUBLISH_TEAM,
    onSuccess: () => {
      toast.success("Team published successfully");
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useRequestToJoinTeamSync = () => {
  return useMutation({
    mutationFn: REQUEST_TEAM_JOIN,
    onSuccess: () => {
      toast.success("Request sent successfully");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetTeamRequestStatusSync = (requestId: string) => {
  const isEnabled = Boolean(requestId);
  return useQuery({
    queryKey: ["requestStatus", requestId],
    queryFn: () => GET_TEAM_REQUEST_STATUS(requestId),
    enabled: isEnabled,
  });
};

export const useWithdrawTeamJoiningRequestSync = () => {
  return useMutation({
    mutationFn: WITHDRAW_TEAM_JOIN_REQUEST,
    onSuccess: () => {
      toast.success("Request withdrawn successfully");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetPendingTeamJoinRequestsSync = (teamId: string) => {
  const isEnabled = Boolean(teamId);
  return useQuery({
    queryKey: ["pendingRequests", teamId],
    queryFn: () => GET_PENDING_TEAM_JOIN_REQUESTS(teamId),
    enabled: isEnabled,
  });
};

export const useUpdateTeamJoinRequestStatusSync = () => {
  return useMutation({
    mutationFn: UPDATE_TEAM_JOIN_REQUEST_STATUS,
    onSuccess: () => {
      toast.success("Request status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDisbandTeamSync = () => {
  return useMutation({
    mutationFn: DISBAND_TEAM,
    onSuccess: () => {
      toast.success("Team disbanded successfully");
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
