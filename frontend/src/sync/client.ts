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
      toast(error.name, {
        description: error.message,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast(error.name, {
        description: error.message,
      });
    },
  }),
});
