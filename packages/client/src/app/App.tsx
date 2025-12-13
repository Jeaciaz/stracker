import { Router } from "@solidjs/router";
import { routes } from "./routes";
import { RouteTabs } from "./RouteTabs";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient } from "./queryClient";
import { ModalContextProvider } from "@shared/ui/Modal";

type NonReadonly<T> = T extends Record<string, unknown> | ReadonlyArray<unknown>
  ? { -readonly [K in keyof T]: NonReadonly<T[K]> }
  : T;

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ModalContextProvider>
      {/* The NonReadonly cast is needed because Router expects a mutable routes array, but we need the readonly for type-safe links */}
      {/* It doesn't actually mutate the array so we're good here */}
      <Router root={RouteTabs}>{routes as NonReadonly<typeof routes>}</Router>
    </ModalContextProvider>
  </QueryClientProvider>
);
