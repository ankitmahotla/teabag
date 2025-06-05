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

export const GET_COHORT_TEAMS = async (cohortId: string) => {
  return (
    await API.get(`/api/teams`, {
      params: {
        cohortId,
      },
    })
  ).data;
};
