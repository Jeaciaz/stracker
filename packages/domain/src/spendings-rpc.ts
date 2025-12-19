import { Schema } from "effect";
import { Category, CategoryId } from "./categories-rpc";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "@effect/platform";

export const SpendingId = Schema.UUID.pipe(Schema.brand("SpendingId"));
export type SpendingId = typeof SpendingId.Type;

export class SpendingCreatePayload extends Schema.Class<SpendingCreatePayload>(
	"SpendingCreateInput",
)({
	amount: Schema.Number.pipe(Schema.nonNaN()),
	description: Schema.String.pipe(Schema.optional),
	categoryId: CategoryId,
}) {}

export class SpendingUpdatePayload extends Schema.Class<SpendingUpdatePayload>(
	"SpendingUpdateInput",
)({
	id: SpendingId,
	amount: Schema.Number.pipe(Schema.optional),
	description: Schema.String.pipe(Schema.optional),
	categoryId: CategoryId.pipe(Schema.optional),
}) {}

export class SpendingDeletePayload extends Schema.Class<SpendingDeletePayload>(
	"SpendingDeleteInput",
)({
	id: SpendingId,
}) {}

export class Spending extends Schema.Class<Spending>("Spending")({
	id: SpendingId,
	amount: Schema.Number.pipe(Schema.nonNaN()),
	description: Schema.String.pipe(Schema.NullOr),
	category: Category,
	createdAt: Schema.DateTimeUtc,
	updatedAt: Schema.DateTimeUtc,
}) {}

export class SpendingNotFoundError extends Schema.TaggedError<SpendingNotFoundError>(
	"SpendingNotFoundError",
)(
	"SpendingNotFoundError",
	{ id: SpendingId },
	HttpApiSchema.annotations({ status: 404 }),
) {
	override get message() {
		return `Spending with id ${this.id} not found`;
	}
}

export class SpendingGroup extends HttpApiGroup.make("spending")
	.add(HttpApiEndpoint.get("list", "/").addSuccess(Schema.Array(Spending)))
	.add(
		HttpApiEndpoint.post("create", "/")
			.setPayload(SpendingCreatePayload)
			.addSuccess(Spending),
	)
	.add(
		HttpApiEndpoint.patch("update", "/")
			.setPayload(SpendingUpdatePayload)
			.addError(SpendingNotFoundError)
			.addSuccess(Spending),
	)
	.add(
		HttpApiEndpoint.del("delete", "/")
			.setPayload(SpendingDeletePayload)
			.addError(SpendingNotFoundError)
			.addSuccess(SpendingId),
	)
	.prefix("/spending") {}
