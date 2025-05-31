import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || error.message || "Something went wrong";

      toast("Error", {
        description: message,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || error.message || "Something went wrong";

      toast("Error", {
        description: message,
      });
    },
  }),
});
