import { CREATE_TEAM } from "@/api/mutation";
import { GET_COHORT_TEAMS } from "@/api/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetCohortTeamsSync = (cohortId: string | undefined) => {
  const isEnabled = Boolean(cohortId);

  const { data, refetch, isRefetching, isLoading } = useQuery({
    queryKey: ["teams", cohortId],
    queryFn: () => GET_COHORT_TEAMS(cohortId!),
    enabled: isEnabled,
  });

  return { data, refetch, isRefetching, isLoading };
};

export const useCreateTeamSync = () => {
  return useMutation({
    mutationFn: CREATE_TEAM,
    onSuccess: () => {
      toast.success("Team created successfully");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
