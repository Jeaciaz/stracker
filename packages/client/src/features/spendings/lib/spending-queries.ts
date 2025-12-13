import { httpClient } from "@shared/lib/httpClient";
import { queryOptions } from "@tanstack/solid-query";
import { Clock, Effect } from "effect";

export const spendingsQueryOptions = queryOptions({
  queryKey: ["spendings"],
  queryFn: () =>
    Effect.gen(function* () {
      yield* Clock.sleep(1000);
      return yield* httpClient.spending.list();
    }).pipe(Effect.runPromise),
});
