import { REFRESH_TOKENS, SIGN_IN, SIGN_OUT } from "@/api/mutation";
import { useSessionStore } from "@/store/session";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignInSync = () => {
  const { newSession, resetSession } = useSessionStore();

  return useMutation({
    mutationFn: SIGN_IN,
    onSuccess: (data) => {
      if (data.user) {
        newSession(data.user);
      } else resetSession();
    },
    onError: () => {
      resetSession();
    },
  });
};

export const useSignOutSync = () => {
  const { resetSession } = useSessionStore();

  return useMutation({
    mutationFn: SIGN_OUT,
    onSuccess: () => {
      resetSession();
      toast.success("Logged out!");
    },
    onError: () => {
      toast.error("Failed to sign out");
    },
  });
};

export const useRefreshTokensSync = () => {
  const { refreshSession, resetSession } = useSessionStore();

  return useMutation({
    mutationFn: REFRESH_TOKENS,
    onSuccess: () => {
      refreshSession();
    },
    onError: () => {
      resetSession();
      toast.error("Failed to refresh tokens");
    },
  });
};
