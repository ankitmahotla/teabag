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
