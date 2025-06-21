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
    await API.post("/api/admin/upload-csv", formData, {
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

export const DISBAND_TEAM = async ({
  teamId,
  reason,
}: {
  teamId: string;
  reason: string;
}) => {
  return (await API.post(`/api/teams/${teamId}/disband`, { reason })).data;
};

export const KICK_TEAM_MEMBER = async ({
  teamId,
  teamMemberId,
  reason,
}: {
  teamId: string;
  teamMemberId: string;
  reason: string;
}) => {
  return (
    await API.post(`/api/teams/${teamId}/kickUser`, {
      teamMemberId,
      reason,
    })
  ).data;
};

export const TEAM_LEADERSHIP_TRANSFER_REQUEST = async ({
  teamId,
  receiverId,
  reason,
}: {
  teamId: string;
  receiverId: string;
  reason: string;
}) => {
  return (
    await API.post(`/api/teams/${teamId}/leadership-transfer`, {
      receiverId,
      reason,
    })
  ).data;
};

export const TEAM_LEADERSHIP_TRANSFER_RESPONSE = async ({
  teamId,
  transferRequestId,
  status,
}: {
  teamId: string;
  transferRequestId: string;
  status: "accepted" | "rejected" | "cancelled";
}) => {
  const response = await API.post(
    `/api/teams/${teamId}/leadership-transfer/respond`,
    {
      transferRequestId,
      status,
    },
  );

  return response.data;
};

export const CREATE_TEAM_NOTICE = async ({
  teamId,
  message,
  postedBy,
}: {
  teamId: string;
  message: string;
  postedBy: string;
}) => {
  return (
    await API.post("/api/notices", {
      teamId,
      message,
      postedBy,
    })
  ).data;
};

export const UPDATE_TEAM_NOTICE = async ({
  id,
  message,
  postedBy,
}: {
  id: string;
  message: string;
  postedBy: string;
}) => {
  return (
    await API.put(`/api/notices/${id}`, {
      message,
      postedBy,
    })
  ).data;
};

export const DELETE_TEAM_NOTICE = async ({
  id,
  postedBy,
}: {
  id: string;
  postedBy: string;
}) => {
  return (await API.delete(`/api/notices/${id}`, { data: { postedBy } })).data;
};

export const LEAVE_TEAM = async ({
  teamId,
  reason,
}: {
  teamId: string;
  reason: string;
}) => {
  return (
    await API.put(`/api/teams/${teamId}/leave`, {
      reason,
    })
  ).data;
};
