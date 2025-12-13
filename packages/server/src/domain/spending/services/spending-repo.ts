import { PgLive } from "@app/database";
import { SqlClient, SqlSchema } from "@effect/sql";
import {
  Spending,
  SpendingCreatePayload,
  SpendingDeletePayload,
  SpendingId,
  SpendingNotFoundError,
  SpendingUpdatePayload,
} from "@app/domain/spendings-rpc";
import { Effect, flow, Schema } from "effect";

export class SpendingRepo extends Effect.Service<SpendingRepo>()(
  "SpendingRepo",
  {
    dependencies: [PgLive],
    effect: Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;

      const findAll = SqlSchema.findAll({
        Result: Spending,
        Request: Schema.Void,
        execute: () => sql`
          select s.*, to_jsonb(c) as category 
          from spendings s 
            join categories c on s.category_id = c.id
        `,
      });

      const create = SqlSchema.single({
        Result: Spending,
        Request: SpendingCreatePayload,
        execute: (request) => {
          return sql`
            with inserted_spending as (
              insert into spendings ${sql.insert(request)} returning *
            ) select inserted_spending.*, to_jsonb(c) as category
              from inserted_spending
                join categories c on inserted_spending.category_id = c.id
          `;
        },
      });

      const update = SqlSchema.single({
        Result: Spending,
        Request: SpendingUpdatePayload,
        execute: (request) =>
          sql`
            with updated_spending as (
              update spendings
                set ${sql.update(request)}            
                where id = ${request.id}
              returning *
            ) select updated_spending.*, to_jsonb(c) as category
              from updated_spending
                join categories c on updated_spending.category_id = c.id
          `,
      });

      const del = SqlSchema.single({
        Result: SpendingId,
        Request: SpendingId,
        execute: (request) =>
          sql`
            delete from spendings
              where id = ${request}
            returning id
          `,
      });

      return {
        findAll: flow(findAll, Effect.orDie),
        create: flow(create, Effect.orDie),
        update: (payload: SpendingUpdatePayload) =>
          update(payload).pipe(
            Effect.catchTag(
              "NoSuchElementException",
              () => new SpendingNotFoundError({ id: payload.id }),
            ),
            Effect.orDie,
          ),
        del: (payload: SpendingDeletePayload) =>
          del(payload.id).pipe(
            Effect.catchTag(
              "NoSuchElementException",
              () => new SpendingNotFoundError({ id: payload.id }),
            ),
            Effect.orDie,
          ),
      };
    }),
  },
) {}
