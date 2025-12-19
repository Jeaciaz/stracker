import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { PgContainer } from "../../../lib/test-utils/pg-container";
import { CategoryRepo } from "./category-repo";

const layer = CategoryRepo.DefaultWithoutDependencies.pipe(
	Layer.provide(PgContainer.Live),
);

it.layer(layer, { timeout: "30 seconds" })((it) => {
	describe("test", () => {
		it.effect("should create a category", () =>
			Effect.gen(function* () {
				const repo = yield* CategoryRepo;
				yield* repo.test.clean();
				const category = yield* repo.create({
					name: "Test Category",
					emoji: "🔥",
				});
				expect(category).toBeDefined();
				expect(category.name).toBe("Test Category");
			}),
		);

		it.effect("should return all categories", () =>
			Effect.gen(function* () {
				const repo = yield* CategoryRepo;
				yield* repo.test.clean();
				yield* repo.create({
					name: "Test Category",
					emoji: "🔥",
				});
				const categories = yield* repo.findAll();

				expect(categories).toHaveLength(1);
				expect(categories[0]?.name).toBe("Test Category");
				expect(categories[0]?.emoji).toBe("🔥");
			}),
		);

		it.effect("should return an empty array if there are no categories", () =>
			Effect.gen(function* () {
				const repo = yield* CategoryRepo;
				yield* repo.test.clean();
				const categories = yield* repo.findAll();
				expect(categories).toHaveLength(0);
			}),
		);

		it.effect("should return a complete Category object with all fields", () =>
			Effect.gen(function* () {
				const repo = yield* CategoryRepo;
				yield* repo.test.clean();
				const category = yield* repo.create({
					name: "Complete Category",
					emoji: "✅",
				});

				expect(category).toBeDefined();
				expect(category.id).toBeDefined();
				expect(typeof category.id).toBe("string");
				expect(category.name).toBe("Complete Category");
				expect(category.emoji).toBe("✅");
				expect(category.createdAt).toBeDefined();
				expect(category.updatedAt).toBeDefined();
			}),
		);

		it.effect("should return all categories when multiple exist", () =>
			Effect.gen(function* () {
				const repo = yield* CategoryRepo;
				yield* repo.test.clean();
				const category1 = yield* repo.create({
					name: "Category 1",
					emoji: "🔥",
				});
				const category2 = yield* repo.create({
					name: "Category 2",
					emoji: "💸",
				});
				const category3 = yield* repo.create({
					name: "Category 3",
					emoji: "🎉",
				});

				const categories = yield* repo.findAll();

				expect(categories).toHaveLength(3);
				expect(categories.map((c) => c.id)).toContain(category1.id);
				expect(categories.map((c) => c.id)).toContain(category2.id);
				expect(categories.map((c) => c.id)).toContain(category3.id);
				expect(categories.map((c) => c.name)).toContain("Category 1");
				expect(categories.map((c) => c.name)).toContain("Category 2");
				expect(categories.map((c) => c.name)).toContain("Category 3");
				expect(categories.map((c) => c.emoji)).toContain("🔥");
				expect(categories.map((c) => c.emoji)).toContain("💸");
				expect(categories.map((c) => c.emoji)).toContain("🎉");
			}),
		);
	});
});
