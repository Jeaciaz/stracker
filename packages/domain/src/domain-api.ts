import { HttpApi } from "@effect/platform";
import { CategoryGroup } from "./categories-rpc";
import { SpendingGroup } from "./spendings-rpc";
import { UserGroup } from "./users-rpc";

export class DomainApi extends HttpApi.make("DomainApi")
  .prefix("/api")
  .add(CategoryGroup)
  .add(SpendingGroup)
  .add(UserGroup) {}
