import { DateTime } from "effect";

export const stringifyMonth = (period: DateTime.Utc) =>
  DateTime.format(period, {
    month: "short",
    year: "2-digit",
  });
