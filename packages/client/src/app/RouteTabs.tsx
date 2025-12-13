import { AppLink } from "@shared/ui/AppLink";
import type { ParentProps } from "solid-js";

export const RouteTabs = (props: ParentProps) => (
  <main class="pt-4 flex flex-col gap-4 bg-base-200 h-[100vh]">
    <h1 class="text-3xl px-4">₪ Tracker</h1>
    <div class="tabs tabs-box flex-grow pb-2">
      <AppLink href="/dashboard" class="tab" aria-label="Dashboard">
        Dashboard
      </AppLink>
      <div class="tab-content bg-base-100 border-base-300 p-2">
        {props.children}
      </div>
      <AppLink href="/spendings" class="tab" aria-label="Spendings">
        Spendings
      </AppLink>
      <div class="tab-content bg-base-100 border-base-300 p-2">
        {props.children}
      </div>
    </div>
  </main>
);
