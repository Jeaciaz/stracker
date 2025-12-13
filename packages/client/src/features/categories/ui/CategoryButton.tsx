import type { Category } from "@domain/categories-rpc";
import { CreateSpendingModal } from "@features/spendings/CreateSpendingModal";
import { useModal } from "@shared/ui/Modal";

type CategoryButtonProps = {
  category: Category;
  monthlySum: number;
};

export const CategoryButton = (props: CategoryButtonProps) => {
  // if last child is only one in row, span whole row
  // if last 2 chilren are left alone, both take equal space
  const buttonColspanClasses =
    "col-span-2 last:nth-[3n-2]:col-span-6 last:nth-[3n-1]:col-span-3 nth-last-[2]:nth-[3n-2]:col-span-3";
  const modalControls = useModal(CreateSpendingModal, {
    category: () => props.category,
  });

  return (
    <button
      class={`btn btn-lg btn-soft btn-primary ${buttonColspanClasses}`}
      onClick={() => modalControls.openModal()}
    >
      <div class="flex flex-col items-center text-sm font-normal">
        <div class="whitespace-nowrap">
          {props.category.emoji} (₪{" "}
          {props.monthlySum.toLocaleString(navigator.language, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          )
        </div>
        <div class="text-xs whitespace-nowrap">{props.category.name}</div>
      </div>
    </button>
  );
};
