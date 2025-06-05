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
