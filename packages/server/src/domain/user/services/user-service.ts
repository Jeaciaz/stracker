import { PgLive } from "@app/database";
import {
  MalformedUserDataError,
  User,
  UserLoginPayload,
} from "@app/domain/users-rpc";
import { SqlClient, SqlSchema } from "@effect/sql";
import { SHA256 } from "bun";
import { Config, DateTime, Effect, Option, Redacted } from "effect";

export class UserService extends Effect.Service<UserService>()("UserService", {
  dependencies: [PgLive],
  effect: Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    const getOrCreateUser = Effect.fn(function* (user: UserLoginPayload) {
      const sql = yield* SqlClient.SqlClient;
      const dbUser = yield* SqlSchema.findOne({
        Request: UserLoginPayload,
        Result: User,
        execute: (request) => sql`
          select * from users where tg_id = ${request.id}`,
      })(user);

      if (Option.isSome(dbUser)) {
        return dbUser.value;
      }

      return yield* SqlSchema.single({
        Request: UserLoginPayload,
        Result: User,
        execute: ({ id, hash, auth_date, ...request }) => {
          return sql`
            insert into users ${sql.insert({ tg_id: id, auth_date: new Date(+`${auth_date}000`).toISOString(), ...request })} returning *
        `;
        },
      })(user);
    });

    return {
      login: Effect.fn(function* (payload: UserLoginPayload) {
        const botToken = yield* Config.redacted("TG_BOT_TOKEN").pipe(
          Effect.orDie,
        );

        const dataCheckString = Object.entries(payload)
          .filter(([key]) => key !== "hash")
          .sort(([key1], [key2]) => key1.localeCompare(key2))
          .map(([key, value]) => {
            const valueStr = DateTime.isUtc(value)
              ? value.epochMillis.toString()
              : `${value}`;
            return `${key}=${valueStr}`;
          })
          .join("\n");

        const hasher = new Bun.CryptoHasher(
          "sha256",
          SHA256.hash(Redacted.value(botToken)),
        );
        hasher.update(dataCheckString);
        const shaHash = hasher.digest("hex");

        if (shaHash !== payload.hash) {
          yield* Effect.fail(new MalformedUserDataError());
        }

        return yield* getOrCreateUser(payload).pipe(
          Effect.provide(PgLive),
          Effect.orDie,
        );
      }),
    };
  }),
}) {}
