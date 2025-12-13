import type { SpendingCreatePayload } from "@domain/spendings-rpc";
import { httpClient } from "@shared/lib/httpClient";
import { useMutation } from "@tanstack/solid-query";
import { Clock, Effect } from "effect";
import { spendingsQueryOptions } from "./spending-queries";

export const useCreateSpending = () =>
  useMutation(() => ({
    mutationFn: (payload: SpendingCreatePayload) =>
      Effect.gen(function* () {
        yield* Clock.sleep(1500);
        yield* httpClient.spending.create({ payload });
      }).pipe(Effect.runPromise),
    meta: {
      invalidatesQueries: [spendingsQueryOptions],
    },
  }));
