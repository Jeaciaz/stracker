import { FetchHttpClient, HttpApiClient } from "@effect/platform";
import { DomainApi } from "@domain/domain-api";
import { Effect } from "effect";

export const httpClient = HttpApiClient.make(DomainApi, {
  baseUrl: "http://localhost:3001",
}).pipe(Effect.provide(FetchHttpClient.layer), Effect.runSync);
