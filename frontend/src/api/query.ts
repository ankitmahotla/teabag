import { API } from "./client";

export const GET_USER_COHORTS = async (userId?: string) => {
  return (
    await API.get("/api/cohorts/getUserCohorts", {
      params: {
        userId,
      },
    })
  ).data;
};
