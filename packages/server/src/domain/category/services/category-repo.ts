import { PgLive } from "@app/database";
import { Category, CategoryCreatePayload } from "@app/domain/categories-rpc";
import { SqlClient, SqlSchema } from "@effect/sql";
import { Effect, flow, Schema } from "effect";

export class CategoryRepo extends Effect.Service<CategoryRepo>()(
	"CategoryRepo",
	{
		dependencies: [PgLive],
		effect: Effect.gen(function* () {
			const sql = yield* SqlClient.SqlClient;

			const create = SqlSchema.single({
				Result: Category,
				Request: CategoryCreatePayload,
				execute: (request) => sql`
          insert into categories ${sql.insert(request)} returning *
        `,
			});

			const findAll = SqlSchema.findAll({
				Result: Category,
				Request: Schema.Void,
				execute: () =>
					Effect.gen(function* () {
						return yield* sql`
              select * from categories
            `;
					}),
			});

			const clean = SqlSchema.void({
				Request: Schema.Void,
				execute: () => sql`delete from categories`,
			});

			return {
				findAll: flow(findAll, Effect.orDie),
				create: flow(create, Effect.orDie),
				test: {
					clean: flow(clean, Effect.orDie),
				},
			};
		}),
	},
) {}
