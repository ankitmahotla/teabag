import { API } from "./client";

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
