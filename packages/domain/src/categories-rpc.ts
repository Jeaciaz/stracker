import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

export const CategoryId = Schema.UUID.pipe(Schema.brand("CategoryId"));
export type CategoryId = typeof CategoryId.Type;

export class Category extends Schema.Class<Category>("Category")({
  id: CategoryId,
  name: Schema.String,
  emoji: Schema.String,
  createdAt: Schema.DateTimeUtc,
  updatedAt: Schema.DateTimeUtc,
}) {}

export class CategoryGroup extends HttpApiGroup.make("category")
  .add(HttpApiEndpoint.get("list", "/").addSuccess(Schema.Array(Category)))
  .prefix("/category") {}
