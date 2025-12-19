import { PgClient } from "@effect/sql-pg";
import { Config, Duration, Effect, identity, Layer, Schedule } from "effect";
import * as String from "effect/String";

export const pgConfig = {
	transformQueryNames: String.camelToSnake,
	transformResultNames: String.snakeToCamel,
	// - 1082: DATE
	// - 1114: TIMESTAMP WITHOUT TIME ZONE
	// - 1184: TIMESTAMP WITH TIME ZONE
	types: {
		1082: {
			to: 25,
			from: [1082],
			parse: identity,
			serialize: identity,
		},
		1114: {
			to: 25,
			from: [1114],
			parse: identity,
			serialize: identity,
		},
		1184: {
			to: 25,
			from: [1184],
			parse: identity,
			serialize: identity,
		},
	},
};

export const PgLive = Layer.unwrapEffect(
	Effect.gen(function* () {
		return PgClient.layer({
			url: yield* Config.redacted("DATABASE_URL"),
			...pgConfig,
			debug: (_connection, query, parameters) =>
				console.log({ query: unescape(query), parameters }),
		});
	}),
).pipe((self) =>
	Layer.retry(
		self,
		Schedule.identity<Layer.Layer.Error<typeof self>>().pipe(
			Schedule.check((input) => input._tag === "SqlError"),
			Schedule.intersect(Schedule.exponential("1 second")),
			Schedule.intersect(Schedule.recurs(2)),
			Schedule.onDecision(([[_error, duration], attempt], decision) =>
				decision._tag === "Continue"
					? Effect.logInfo(
							`Retrying database connection in ${Duration.format(duration)} (attempt #${++attempt})`,
						)
					: Effect.void,
			),
		),
	),
);
