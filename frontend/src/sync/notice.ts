import {
  CREATE_TEAM_NOTICE,
  UPDATE_TEAM_NOTICE,
  DELETE_TEAM_NOTICE,
} from "@/api/mutation";
import { GET_TEAM_NOTICES } from "@/api/query";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTeamNotices = (teamId: string) => {
  return useQuery({
    queryKey: ["team-notices", teamId],
    queryFn: () => GET_TEAM_NOTICES(teamId),
    enabled: !!teamId,
  });
};

export const useCreateNotice = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CREATE_TEAM_NOTICE,
    onSuccess: () => {
      toast.success("Notice created");
    },
    onError: () => {
      toast.error("Failed to create notice");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team-notices", teamId] });
    },
  });
};

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UPDATE_TEAM_NOTICE,
    onSuccess: () => {
      toast.success("Notice updated");
    },
    onError: () => {
      toast.error("Failed to update notice");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team-notices"] });
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DELETE_TEAM_NOTICE,
    onSuccess: () => {
      toast.success("Notice deleted");
    },
    onError: () => {
      toast.error("Failed to delete notice");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team-notices"] });
    },
  });
};
