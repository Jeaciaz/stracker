import { DomainApi } from "@app/domain/domain-api";
import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";
import { UserService } from "./services/user-service";
import type { User } from "@app/domain/users-rpc";

export const UserRpcLive = HttpApiBuilder.group(DomainApi, "user", (handlers) =>
  Effect.gen(function* () {
    const userService = yield* UserService;

    return handlers
      .handle("login", ({ urlParams }) => userService.login(urlParams))
      .handle("me", () => ({}) as Effect.Effect<User, never, never>);
  }).pipe(Effect.provide(UserService.Default)),
);
