import type { AppRoute } from "@app/routes";
import { A } from "@solidjs/router";
import type { ComponentProps } from "solid-js";

type AppLinkProps = ComponentProps<typeof A> & {
  href: AppRoute;
};

export const AppLink = (props: AppLinkProps) => <A {...props} />;
