import { MutationCache, QueryClient } from "@tanstack/solid-query";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (_data, _variables, _onMutateResult, mutation) => {
      if (mutation.meta?.invalidatesQueries) {
        await Promise.allSettled(
          mutation.meta.invalidatesQueries.map((queryKey) =>
            queryClient.invalidateQueries(queryKey),
          ),
        );
      }
    },
  }),
});
