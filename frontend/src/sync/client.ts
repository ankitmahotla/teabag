import { getErrorMessage } from "@/utils/get-error";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast("Error", {
        description: getErrorMessage(error),
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast("Error", {
        description: getErrorMessage(error),
      });
    },
  }),
});
