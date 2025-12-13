import type { Category } from "@domain/categories-rpc";
import { createSignal, Show, type Accessor } from "solid-js";
import { useCreateSpending } from "./lib/spending-mutations";
import { SpendingCreatePayload } from "@domain/spendings-rpc";
import { Either, Schema } from "effect";
import type { ModalProps } from "@shared/ui/Modal";

type CreateSpendingModalArgs = {
  category: Accessor<Category>;
};

export const CreateSpendingModal = (
  props: ModalProps<CreateSpendingModalArgs>,
) => {
  const [amount, setAmount] = createSignal("");
  const [description, setDescription] = createSignal("");
  const createSpendingMutation = useCreateSpending();

  return (
    <>
      <div>Create spending for {props.category().name}</div>
      <div class="flex flex-col gap-2 py-4">
        <label class="input">
          <span>Amount</span>
          <input
            type="text"
            class="grow"
            placeholder="100"
            value={amount()}
            onInput={(e) => setAmount(e.currentTarget.value)}
          />
        </label>
        <label class="input input-sm">
          <span>Description</span>
          <input
            type="text"
            class="grow"
            placeholder="Groceries"
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
          />
        </label>
      </div>
      <button
        class="btn btn-primary w-full"
        disabled={createSpendingMutation.isPending}
        onClick={() => {
          const payload = SpendingCreatePayload.pipe(Schema.decodeEither)({
            amount: parseFloat(amount().replace(",", ".")),
            categoryId: props.category().id,
            description: description(),
          });

          if (Either.isLeft(payload)) {
            alert("Please enter the correct amount");
            return;
          }

          createSpendingMutation.mutate(payload.right, {
            onSuccess: () => props.onClose(),
          });
        }}
      >
        <Show
          when={!createSpendingMutation.isPending}
          fallback={<span class="loading loading-spinner" />}
        >
          Create
        </Show>
      </button>
    </>
  );
};
