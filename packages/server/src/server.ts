import { HttpApiSwagger, HttpLayerRouter } from "@effect/platform";
import { DomainApi } from "@app/domain/domain-api";
import { Layer } from "effect";
import { CategoryRpcLive } from "./domain/category/category-rpc-live";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { SpendingRpcLive } from "./domain/spending/spending-rpc-live";

const ApiLive = HttpLayerRouter.addHttpApi(DomainApi).pipe(
  Layer.provide(CategoryRpcLive),
  Layer.provide(SpendingRpcLive),
);

const AppRoutes = ApiLive.pipe(
  Layer.provide(
    HttpLayerRouter.cors({
      allowedOrigins: ["*"],
      allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    }),
  ),
  Layer.provide(
    HttpApiSwagger.layerHttpLayerRouter({ api: DomainApi, path: "/docs" }),
  ),
);

const HttpLive = HttpLayerRouter.serve(AppRoutes).pipe(
  Layer.provide(BunHttpServer.layer({ port: 3001 })),
);

BunRuntime.runMain(Layer.launch(HttpLive));
