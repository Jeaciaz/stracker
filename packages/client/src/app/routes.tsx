import { Pages } from "@pages";
import { Navigate } from "@solidjs/router";

export const routes = [
  { path: "/", component: () => <Navigate href="/dashboard" /> },
  { path: "/dashboard", component: Pages.Dashboard },
  { path: "/spendings", component: Pages.Spendings },
] as const;

export type AppRoute = (typeof routes)[number]["path"];
