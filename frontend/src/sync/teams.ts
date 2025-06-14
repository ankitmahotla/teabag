import {
  CREATE_TEAM,
  DISBAND_TEAM,
  KICK_TEAM_MEMBER,
  REQUEST_TEAM_JOIN,
  TEAM_LEADERSHIP_TRANSFER_REQUEST,
  TEAM_LEADERSHIP_TRANSFER_RESPONSE,
  TOGGLE_PUBLISH_TEAM,
  UPDATE_TEAM_JOIN_REQUEST_STATUS,
  WITHDRAW_TEAM_JOIN_REQUEST,
} from "@/api/mutation";
import {
  GET_COHORT_TEAMS,
  GET_PENDING_TEAM_JOIN_REQUESTS,
  GET_PENDING_TEAM_LEADERSHIP_TRANSFERS,
  GET_TEAM_BY_ID,
  GET_TEAM_MEMBERS,
  GET_TEAM_REQUEST_STATUS,
  GET_USER_TEAM_BY_COHORT,
} from "@/api/query";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "./client";

export const useGetCohortTeamsSync = (cohortId: string) => {
  return useSuspenseQuery({
    queryKey: ["teams", cohortId],
    queryFn: () => GET_COHORT_TEAMS(cohortId),
  });
};

export const useGetTeamByIdSync = (teamId: string) => {
  return useSuspenseQuery({
    queryKey: ["team", teamId],
    queryFn: () => GET_TEAM_BY_ID(teamId),
  });
};

export const useGetUserTeamByCohortSync = (cohortId: string) => {
  return useSuspenseQuery({
    queryKey: ["userTeam", cohortId],
    queryFn: () => GET_USER_TEAM_BY_COHORT(cohortId),
    retry: 1,
  });
};

export const useTogglePublishTeamSync = (teamId: string) => {
  return useMutation({
    mutationFn: TOGGLE_PUBLISH_TEAM,
    onSuccess: () => {
      toast.success("Team published successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useRequestToJoinTeamSync = (teamId: string) => {
  return useMutation({
    mutationFn: REQUEST_TEAM_JOIN,
    onSuccess: () => {
      toast.success("Request sent successfully");
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
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

export const useUpdateTeamJoinRequestStatusSync = (teamId: string) => {
  return useMutation({
    mutationFn: UPDATE_TEAM_JOIN_REQUEST_STATUS,
    onSuccess: () => {
      toast.success("Request status updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateTeamSync = (cohortId: string) => {
  return useMutation({
    mutationFn: CREATE_TEAM,
    onMutate: async (newTeam) => {
      await queryClient.cancelQueries({ queryKey: ["userTeam", cohortId] });
      const previousUserTeam = queryClient.getQueryData(["userTeam", cohortId]);
      queryClient.setQueryData(["userTeam", cohortId], newTeam);
      return { previousUserTeam };
    },
    onError: (err, newTeam, context) => {
      console.error(err);
      queryClient.setQueryData(
        ["userTeam", cohortId],
        context?.previousUserTeam,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam", cohortId] });
    },
    onSuccess: () => {
      toast.success("Team created successfully");
      queryClient.invalidateQueries({ queryKey: ["teams", "team"] });
    },
  });
};

export const useDisbandTeamSync = (teamId: string) => {
  return useMutation({
    mutationFn: DISBAND_TEAM,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
    },
    onSuccess: () => {
      toast.success("Team disbanded successfully");
    },
  });
};

export const useGetTeamMembersSync = (teamId: string) => {
  return useQuery({
    queryKey: ["teamMembers", teamId],
    queryFn: () => GET_TEAM_MEMBERS(teamId),
    enabled: !!teamId,
  });
};

export const useKickTeamMemberSync = (teamId: string) => {
  return useMutation({
    mutationFn: KICK_TEAM_MEMBER,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers", teamId] });
    },
    onSuccess: () => {
      toast.success("Team member kicked successfully");
    },
  });
};

export const useTeamLeaderShipTransferRequestSync = (teamId: string) => {
  return useMutation({
    mutationFn: TEAM_LEADERSHIP_TRANSFER_REQUEST,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers", teamId] });
    },
    onSuccess: () => {
      toast.success("Team leader transfer request sent successfully");
    },
  });
};

export const useTeamLeadershipTransferResponse = (teamId: string) => {
  return useMutation({
    mutationFn: TEAM_LEADERSHIP_TRANSFER_RESPONSE,
    onSuccess: (_, variables) => {
      toast.success(`Leadership transfer ${variables.status}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamLeadershipTransfers", teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pendingLeadershipTransfers"],
      });
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
    },
  });
};

export const usePendingTeamLeadershipTransfersSync = () => {
  return useQuery({
    queryKey: ["pendingLeadershipTransfers"],
    queryFn: GET_PENDING_TEAM_LEADERSHIP_TRANSFERS,
  });
};
