import { DomainApi } from "@app/domain/domain-api";
import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { CategoryRepo } from "./services/category-repo";

export const CategoryRpcLive = HttpApiBuilder.group(
  DomainApi,
  "category",
  (handlers) =>
    Effect.gen(function* () {
      const repo = yield* CategoryRepo;

      return handlers.handle("list", () => repo.findAll());
    }),
).pipe(Layer.provide(CategoryRepo.Default));
