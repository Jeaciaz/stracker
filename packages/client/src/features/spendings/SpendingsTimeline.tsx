import { Spending } from "@domain/spendings-rpc";
import { Array, DateTime, Order, pipe } from "effect";
import { For } from "solid-js";
import { stringifyMonth } from "./lib/spending-period";

type SpendingsTimelineProps = {
  spendings: readonly Spending[];
  selectedMonth?: DateTime.Utc;
  onLabelSelect?: (label: DateTime.Utc) => void;
};

type TimelineItems = Record<string, { date: DateTime.Utc; amount: number }>;

export const SpendingsTimeline = (props: SpendingsTimelineProps) => {
  const dateNow = DateTime.unsafeNow().pipe(DateTime.startOf("month"));

  const timelineItems = () =>
    pipe(
      props.spendings.reduce<TimelineItems>(
        (acc, item) => {
          const dateLabel = stringifyMonth(item.createdAt);
          acc[dateLabel] = {
            date: item.createdAt,
            amount: (acc[dateLabel]?.amount ?? 0) + item.amount,
          };

          return acc;
        },
        { [stringifyMonth(dateNow)]: { date: dateNow, amount: 0 } },
      ),
      Object.values<TimelineItems[string]>,
      Array.sortBy(
        Order.mapInput(Order.reverse(DateTime.Order), (entry) => entry.date),
      ),
    );

  return (
    <ul class="timeline w-full overflow-x-auto">
      <For each={timelineItems()}>
        {({ date, amount }, i) => (
          <li
            class="bg-base-100"
            classList={{ "sticky left-0 z-1 animate-scroll-shadow": i() === 0 }}
          >
            {i() > 0 && <hr class="bg-primary opacity-75" />}
            <div
              class="timeline-start"
              classList={{
                "text-xl text-primary": DateTime.Equivalence(
                  DateTime.startOf(date, "month"),
                  DateTime.startOf(dateNow, "month"),
                ),
              }}
            >
              {stringifyMonth(date)}
            </div>
            <div class="timeline-middle">₪</div>
            <div class="timeline-end">
              <button
                class="btn btn-sm btn-primary"
                classList={{
                  "btn-soft":
                    !props.selectedMonth ||
                    !DateTime.Equivalence(
                      DateTime.startOf(date, "month"),
                      DateTime.startOf(props.selectedMonth, "month"),
                    ),
                }}
                onClick={() => props.onLabelSelect?.(date)}
              >
                {amount.toLocaleString(navigator.language, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </button>
            </div>
            {i() < timelineItems().length - 1 && (
              <hr
                class="bg-primary"
                classList={{
                  "opacity-75": i() > 0,
                }}
              />
            )}
          </li>
        )}
      </For>
    </ul>
  );
};
