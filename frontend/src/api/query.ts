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
