import { DomainApi } from "@app/domain/domain-api";
import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { SpendingRepo } from "./services/spending-repo";

export const SpendingRpcLive = HttpApiBuilder.group(
  DomainApi,
  "spending",
  (handlers) =>
    Effect.gen(function* () {
      const repo = yield* SpendingRepo;

      return handlers
        .handle("list", () => repo.findAll())
        .handle("create", ({ payload }) => repo.create(payload))
        .handle("update", ({ payload }) => repo.update(payload))
        .handle("delete", ({ payload }) => repo.del(payload));
    }),
).pipe(Layer.provide(SpendingRepo.Default));
