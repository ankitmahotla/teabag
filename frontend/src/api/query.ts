import { PaginatedInteractionsResponse } from "@/types/user";
import { API } from "./client";

export const GET_USER_COHORTS = async (userId?: string) => {
  return (
    await API.get("/api/user/cohorts", {
      params: {
        userId,
      },
    })
  ).data;
};

export const GET_USER_TEAM_BY_COHORT = async (cohortId: string) => {
  return (await API.get(`/api/user/team/${cohortId}`)).data;
};

export const GET_COHORT_TEAMS = async (cohortId: string) => {
  return (
    await API.get(`/api/teams`, {
      params: {
        cohortId,
      },
    })
  ).data;
};

export const GET_TEAM_BY_ID = async (teamId: string) => {
  return (await API.get(`/api/teams/${teamId}`)).data;
};

export const GET_USER_BY_ID = async (userId: string) => {
  return (await API.get(`/api/user/${userId}`)).data;
};

export const GET_TEAM_REQUEST_STATUS = async (teamId: string) => {
  return (await API.get(`/api/teams/${teamId}/request-status`)).data;
};

export const GET_USER_TEAM_JOINING_REQUESTS_BY_COHORT = async (
  cohortId: string,
) => {
  return (
    await API.get(`/api/user/requests/${cohortId}`, {
      params: {
        cohortId,
      },
    })
  ).data;
};

export const GET_PENDING_TEAM_JOIN_REQUESTS = async (teamId: string) => {
  return (await API.get(`/api/teams/${teamId}/pending-requests`)).data;
};

export const GET_TEAM_MEMBERS = async (teamId: string) => {
  return (await API.get(`/api/teams/${teamId}/members`)).data;
};

export const GET_PENDING_TEAM_LEADERSHIP_TRANSFERS = async () => {
  return (await API.get("/api/teams/leadership-transfer/requests/pending"))
    .data;
};

export const GET_TEAM_NOTICES = async (teamId: string) => {
  return (await API.get(`/api/notices/${teamId}`)).data;
};

export const GET_USER_INTERACTIONS = async (
  userId: string,
  cursor?: string,
  limit = 10,
): Promise<PaginatedInteractionsResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  params.append("limit", limit.toString());

  const res = await API.get(`/api/user/${userId}/interactions?${params}`);
  return res.data;
};
