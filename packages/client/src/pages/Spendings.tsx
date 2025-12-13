import type { Spending } from "@domain/spendings-rpc";
import { spendingsQueryOptions } from "@features/spendings/lib/spending-queries";
import { useQuery } from "@tanstack/solid-query";
import { DateTime, Order, pipe } from "effect";
import { Show, Suspense } from "solid-js";

export const Spendings = () => {
  const spendingsQuery = useQuery(() => spendingsQueryOptions);

  return (
    <div class="flex flex-col">
      <Suspense
        fallback={
          <span class="loading loading-spinner loading-xl self-center" />
        }
      >
        <ul>
          {spendingsQuery.data
            ?.toSorted(
              pipe(
                DateTime.Order,
                Order.reverse,
                Order.mapInput((spending) => spending.createdAt),
              ),
            )
            .map((spending) => (
              <li class="border-base-content/30 dark:border-base-content-60 rounded-none border-b py-3">
                <div class="flex">
                  <div>
                    <div>{spending.amount} ₪</div>
                    <div class="text-xs">Spending author</div>
                    <div
                      class="text-xs text-base-content/70"
                      hidden={!spending.description}
                    >
                      {spending.description}
                    </div>
                  </div>
                  <div class="flex flex-col justify-between ms-auto text-sm text-end">
                    <div>
                      {spending.category.name} {spending.category.emoji}
                    </div>
                    <div class="text-sm text-base-content/70">
                      {spending.createdAt.pipe(
                        DateTime.formatLocal({
                          locale: "ru-RU",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }),
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </Suspense>
    </div>
  );
};
