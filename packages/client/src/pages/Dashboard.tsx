import type { CategoryId } from "@domain/categories-rpc";
import { categoriesQueryOptions } from "@features/categories/lib/categories-queries";
import { CategoryButton } from "@features/categories/ui";
import { SpendingsTimeline } from "@features/spendings/SpendingsTimeline";
import { spendingsQueryOptions } from "@features/spendings/lib/spending-queries";
import { useQuery } from "@tanstack/solid-query";
import { DateTime, Effect } from "effect";
import { createSignal, For, Suspense } from "solid-js";

export const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = createSignal<DateTime.Utc>(
    DateTime.now.pipe(Effect.runSync),
  );
  const categoriesQuery = useQuery(() => categoriesQueryOptions);
  const spendingsQuery = useQuery(() => spendingsQueryOptions);

  const categoryMonthlySum = (categoryId: CategoryId) => {
    const month = selectedMonth();
    return (
      spendingsQuery.data
        ?.filter(
          (spending) =>
            spending.category.id === categoryId &&
            DateTime.between(spending.createdAt, {
              minimum: DateTime.startOf(month, "month"),
              maximum: DateTime.endOf(month, "month"),
            }),
        )
        .reduce((acc, spending) => {
          return acc + spending.amount;
        }, 0) ?? 0
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div class="grid grid-cols-6 gap-2">
        <For each={categoriesQuery.data ?? []}>
          {(category) => (
            <CategoryButton
              category={category}
              monthlySum={categoryMonthlySum(category.id)}
            />
          )}
        </For>
      </div>
      <SpendingsTimeline
        spendings={spendingsQuery.data ?? []}
        selectedMonth={selectedMonth()}
        onLabelSelect={setSelectedMonth}
      />
    </Suspense>
  );
};
