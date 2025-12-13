import { Effect, flow, Schema } from "effect";
import { PgLive } from "@app/database";
import { SqlClient, SqlSchema } from "@effect/sql";
import { Category } from "@app/domain/categories-rpc";

export class CategoryRepo extends Effect.Service<CategoryRepo>()(
  "CategoryRepo",
  {
    dependencies: [PgLive],
    effect: Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;

      const findAll = SqlSchema.findAll({
        Result: Category,
        Request: Schema.Void,
        execute: () => sql`
          select * from categories
        `,
      });

      return { findAll: flow(findAll, Effect.orDie) };
    }),
  },
) {}
