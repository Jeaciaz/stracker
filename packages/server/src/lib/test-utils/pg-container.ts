import { pgConfig } from "@app/database";
import { FileSystem } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { SqlClient } from "@effect/sql";
import { PgClient } from "@effect/sql-pg";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Effect, Layer, Redacted } from "effect";
import path from "path";
import { fileURLToPath } from "url";

export class PgContainer extends Effect.Service<PgContainer>()("PgContainer", {
	scoped: Effect.acquireRelease(
		Effect.promise(() => new PostgreSqlContainer("postgres:18-alpine").start()),
		(container) => Effect.promise(() => container.stop()),
	),
}) {
	static readonly Live = Layer.effectDiscard(
		Effect.gen(function* () {
			const fs = yield* FileSystem.FileSystem;
			const sql = yield* SqlClient.SqlClient;
			const currentFileDir = path.dirname(fileURLToPath(import.meta.url));
			const schemaPath = path.resolve(
				currentFileDir,
				"..",
				"..",
				"..",
				"..",
				"database",
				"src",
				"migrations",
				"sql",
				"_schema.sql",
			);

			const schema = yield* fs.readFileString(schemaPath);
			yield* sql.unsafe(schema.replace(/\\.*$/gm, ""));
		}),
	).pipe(
		Layer.provideMerge(
			Layer.unwrapEffect(
				Effect.gen(function* () {
					const container = yield* PgContainer;
					return PgClient.layer({
						url: Redacted.make(container.getConnectionUri()),
						...pgConfig,
					});
				}),
			),
		),
		Layer.provide(PgContainer.Default),
		Layer.provide(BunContext.layer),
	);
}
