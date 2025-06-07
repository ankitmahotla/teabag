import axios from "axios";
import { API } from "./client";
import { TEAM_CREATE } from "@/types/team";

export const SIGN_IN = async ({ code }: { code: string }) => {
  return (
    await API.post("/api/auth/sign-in", {
      code,
    })
  ).data;
};

export const SIGN_OUT = async () => {
  return (await API.post("/api/auth/sign-out")).data;
};

export const REFRESH_TOKENS = async () => {
  return (await API.post("/api/auth/refresh-tokens")).data;
};

export const UPLOAD_CSV = async (formData: FormData) => {
  return (
    await axios.post("http://localhost:8000/api/admin/upload-csv", formData, {
      withCredentials: true,
    })
  ).data;
};

export const CREATE_TEAM = async (team: TEAM_CREATE) => {
  return (await API.post("/api/teams", team)).data;
};

export const TOGGLE_PUBLISH_TEAM = async (teamId: string) => {
  return (await API.put(`/api/teams/${teamId}/toggle-publish`)).data;
};

export const REQUEST_TEAM_JOIN = async ({
  teamId,
  note,
  cohortId,
}: {
  teamId: string;
  note: string;
  cohortId: string;
}) => {
  return (
    await API.post(`/api/teams/${teamId}/request-join`, { note, cohortId })
  ).data;
};

export const WITHDRAW_TEAM_JOIN_REQUEST = async (teamId: string) => {
  return (await API.put(`/api/teams/${teamId}/request-join`)).data;
};

export const UPDATE_TEAM_JOIN_REQUEST_STATUS = async ({
  teamId,
  requestId,
  status,
}: {
  teamId: string;
  requestId: string;
  status: string;
}) => {
  return (
    await API.put(`/api/teams/${teamId}/requests/${requestId}/status`, {
      status,
    })
  ).data;
};
