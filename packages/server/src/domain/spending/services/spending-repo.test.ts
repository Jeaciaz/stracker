import { SpendingId, SpendingNotFoundError } from "@app/domain/spendings-rpc";
import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer, Schema } from "effect";
import { PgContainer } from "../../../lib/test-utils/pg-container";
import { CategoryRepo } from "../../category/services/category-repo";
import { SpendingRepo } from "./spending-repo";

const layer = SpendingRepo.DefaultWithoutDependencies.pipe(
	Layer.provideMerge(CategoryRepo.DefaultWithoutDependencies),
	Layer.provide(PgContainer.Live),
);

it.layer(layer, { timeout: "30 seconds" })((it) => {
	describe("SpendingRepo", () => {
		it.effect("should create a spending", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				const categoryRepo = yield* CategoryRepo;
				yield* spendingRepo.test.clean();
				yield* categoryRepo.test.clean();

				const category = yield* categoryRepo.create({
					name: "Test Category",
					emoji: "🔥",
				});

				const spending = yield* spendingRepo.create({
					amount: 100.5,
					description: "Test spending",
					categoryId: category.id,
				});

				expect(spending).toBeDefined();
				expect(spending.amount).toBe(100.5);
				expect(spending.description).toBe("Test spending");
				expect(spending.category.id).toBe(category.id);
			}),
		);

		it.effect("should return all spendings", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				const categoryRepo = yield* CategoryRepo;
				yield* spendingRepo.test.clean();
				yield* categoryRepo.test.clean();

				const category = yield* categoryRepo.create({
					name: "Test Category",
					emoji: "🔥",
				});

				yield* spendingRepo.create({
					amount: 50,
					description: "Test spending",
					categoryId: category.id,
				});

				const spendings = yield* spendingRepo.findAll();

				expect(spendings).toHaveLength(1);
				expect(spendings[0]?.amount).toBe(50);
				expect(spendings[0]?.description).toBe("Test spending");
				expect(spendings[0]?.category.id).toBe(category.id);
			}),
		);

		it.effect("should return an empty array if there are no spendings", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				yield* spendingRepo.test.clean();
				const spendings = yield* spendingRepo.findAll();
				expect(spendings).toHaveLength(0);
			}),
		);

		it.effect("should return a complete Spending object with all fields", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				const categoryRepo = yield* CategoryRepo;
				yield* spendingRepo.test.clean();
				yield* categoryRepo.test.clean();

				const category = yield* categoryRepo.create({
					name: "Test Category",
					emoji: "🔥",
				});

				const spending = yield* spendingRepo.create({
					amount: 75.25,
					description: "Complete spending",
					categoryId: category.id,
				});

				expect(spending).toBeDefined();
				expect(spending.id).toBeDefined();
				expect(typeof spending.id).toBe("string");
				expect(spending.amount).toBe(75.25);
				expect(spending.description).toBe("Complete spending");
				expect(spending.category).toBeDefined();
				expect(spending.category.id).toBe(category.id);
				expect(spending.category.name).toBe("Test Category");
				expect(spending.createdAt).toBeDefined();
				expect(spending.updatedAt).toBeDefined();
			}),
		);

		it.effect("should return all spendings when multiple exist", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				const categoryRepo = yield* CategoryRepo;
				yield* spendingRepo.test.clean();
				yield* categoryRepo.test.clean();

				const category1 = yield* categoryRepo.create({
					name: "Category 1",
					emoji: "🔥",
				});
				const category2 = yield* categoryRepo.create({
					name: "Category 2",
					emoji: "💸",
				});

				const spending1 = yield* spendingRepo.create({
					amount: 100,
					description: "Spending 1",
					categoryId: category1.id,
				});
				const spending2 = yield* spendingRepo.create({
					amount: 200,
					description: "Spending 2",
					categoryId: category2.id,
				});
				const spending3 = yield* spendingRepo.create({
					amount: 300,
					categoryId: category1.id,
				});

				const spendings = yield* spendingRepo.findAll();

				expect(spendings).toHaveLength(3);
				expect(spendings.map((s) => s.id)).toContain(spending1.id);
				expect(spendings.map((s) => s.id)).toContain(spending2.id);
				expect(spendings.map((s) => s.id)).toContain(spending3.id);
				expect(spendings.map((s) => s.amount)).toContain(100);
				expect(spendings.map((s) => s.amount)).toContain(200);
				expect(spendings.map((s) => s.amount)).toContain(300);
			}),
		);

		it.effect("should update a spending", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				const categoryRepo = yield* CategoryRepo;
				yield* spendingRepo.test.clean();
				yield* categoryRepo.test.clean();

				const category1 = yield* categoryRepo.create({
					name: "Category 1",
					emoji: "🔥",
				});
				const category2 = yield* categoryRepo.create({
					name: "Category 2",
					emoji: "💸",
				});

				const spending = yield* spendingRepo.create({
					amount: 100,
					description: "Original description",
					categoryId: category1.id,
				});

				const updated = yield* spendingRepo.update({
					id: spending.id,
					amount: 150,
					description: "Updated description",
					categoryId: category2.id,
				});

				expect(updated.id).toBe(spending.id);
				expect(updated.amount).toBe(150);
				expect(updated.description).toBe("Updated description");
				expect(updated.category.id).toBe(category2.id);
			}),
		);

		it.effect("should update a spending with partial fields", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				const categoryRepo = yield* CategoryRepo;
				yield* spendingRepo.test.clean();
				yield* categoryRepo.test.clean();

				const category = yield* categoryRepo.create({
					name: "Test Category",
					emoji: "🔥",
				});

				const spending = yield* spendingRepo.create({
					amount: 100,
					description: "Original description",
					categoryId: category.id,
				});

				const updated = yield* spendingRepo.update({
					id: spending.id,
					amount: 150,
				});

				expect(updated.id).toBe(spending.id);
				expect(updated.amount).toBe(150);
				expect(updated.description).toBe("Original description");
				expect(updated.category.id).toBe(category.id);
			}),
		);

		it.effect(
			"should throw SpendingNotFoundError when updating non-existent spending",
			() =>
				Effect.gen(function* () {
					const spendingRepo = yield* SpendingRepo;
					const categoryRepo = yield* CategoryRepo;
					yield* spendingRepo.test.clean();
					yield* categoryRepo.test.clean();

					const category = yield* categoryRepo.create({
						name: "Test Category",
						emoji: "🔥",
					});

					const nonExistentId = Schema.decodeUnknownSync(SpendingId)(
						"00000000-0000-0000-0000-000000000000",
					);

					const result = yield* spendingRepo
						.update({
							id: nonExistentId,
							amount: 100,
							categoryId: category.id,
						})
						.pipe(Effect.either);

					expect(result._tag).toBe("Left");
					if (result._tag === "Left") {
						expect(result.left).toBeInstanceOf(SpendingNotFoundError);
						expect(result.left.id).toBe(nonExistentId);
					}
				}),
		);

		it.effect("should delete a spending", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				const categoryRepo = yield* CategoryRepo;
				yield* spendingRepo.test.clean();
				yield* categoryRepo.test.clean();

				const category = yield* categoryRepo.create({
					name: "Test Category",
					emoji: "🔥",
				});

				const spending = yield* spendingRepo.create({
					amount: 100,
					description: "To be deleted",
					categoryId: category.id,
				});

				const deletedId = yield* spendingRepo.del({ id: spending.id });

				expect(deletedId).toBe(spending.id);

				const spendings = yield* spendingRepo.findAll();
				expect(spendings).toHaveLength(0);
			}),
		);

		it.effect(
			"should throw SpendingNotFoundError when deleting non-existent spending",
			() =>
				Effect.gen(function* () {
					const spendingRepo = yield* SpendingRepo;
					yield* spendingRepo.test.clean();

					const nonExistentId = Schema.decodeUnknownSync(SpendingId)(
						"00000000-0000-0000-0000-000000000000",
					);

					const result = yield* spendingRepo
						.del({ id: nonExistentId })
						.pipe(Effect.either);

					expect(result._tag).toBe("Left");
					if (result._tag === "Left") {
						expect(result.left).toBeInstanceOf(SpendingNotFoundError);
						expect(result.left.id).toBe(nonExistentId);
					}
				}),
		);

		it.effect("should create a spending without description", () =>
			Effect.gen(function* () {
				const spendingRepo = yield* SpendingRepo;
				const categoryRepo = yield* CategoryRepo;
				yield* spendingRepo.test.clean();
				yield* categoryRepo.test.clean();

				const category = yield* categoryRepo.create({
					name: "Test Category",
					emoji: "🔥",
				});

				const spending = yield* spendingRepo.create({
					amount: 50,
					categoryId: category.id,
				});

				expect(spending).toBeDefined();
				expect(spending.amount).toBe(50);
				expect(spending.description).toBe(null);
				expect(spending.category.id).toBe(category.id);
			}),
		);
	});
});
