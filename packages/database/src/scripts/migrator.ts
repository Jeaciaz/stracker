import { BunContext, BunRuntime } from "@effect/platform-bun";
import { PgMigrator } from "@effect/sql-pg";
import { Effect } from "effect";
import path from "path";
import { fileURLToPath } from "url";
import { PgLive } from "../database";

BunRuntime.runMain(
  Effect.gen(function* () {
    const migrations = yield* PgMigrator.run({
      loader: PgMigrator.fromFileSystem(
        path.join(
          fileURLToPath(new URL(".", import.meta.url)),
          "../migrations",
        ),
      ),
      schemaDirectory: path.join(
        fileURLToPath(new URL(".", import.meta.url)),
        "../migrations/sql",
      ),
    });

    if (migrations.length === 0) {
      yield* Effect.log("No new migrations to run");
      return;
    }

    yield* Effect.log(`Running ${migrations.length} migrations:`);
    for (const [id, name] of migrations) {
      yield* Effect.log(`- ${id.toString().padStart(4, "0")}__${name}`);
    }
  }).pipe(Effect.provide([BunContext.layer, PgLive])),
);
