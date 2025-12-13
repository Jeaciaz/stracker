import { lazy } from "solid-js";

const renameToDefault =
  <Exports, Key extends keyof Exports>(key: Key) =>
  (exports: Exports) => ({ default: exports[key] });

export const Pages = {
  Dashboard: lazy(() =>
    import("./Dashboard").then(renameToDefault("Dashboard")),
  ),
  Spendings: lazy(() =>
    import("./Spendings").then(renameToDefault("Spendings")),
  ),
};
