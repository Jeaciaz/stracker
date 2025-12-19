import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "@effect/platform";
import { Schema } from "effect";

export const UserId = Schema.String.pipe(Schema.brand("UserId"));
export type UserId = typeof UserId.Type;

export class User extends Schema.Class<User>("User")({
  id: UserId,
  firstName: Schema.String,
  lastName: Schema.String.pipe(Schema.NullOr),
  username: Schema.String,
  photoUrl: Schema.String.pipe(Schema.NullOr),
  authDate: Schema.DateTimeUtc,
}) {}

export class UserLoginPayload extends Schema.Class<UserLoginPayload>(
  "UserLoginPayload",
)({
  id: UserId,
  first_name: Schema.String,
  last_name: Schema.String.pipe(Schema.optional),
  username: Schema.String,
  photo_url: Schema.String.pipe(Schema.optional),
  auth_date: Schema.transform(Schema.String, Schema.DateTimeUtcFromSelf, {
    decode: (str) =>
      Schema.decodeSync(Schema.DateTimeUtcFromNumber)(parseInt(str)),
    encode: (utc) => `${utc.epochMillis}`,
    strict: true,
  }),
  hash: Schema.String,
}) {}

export class MalformedUserDataError extends Schema.TaggedError<MalformedUserDataError>(
  "MalformedUserDataError",
)("MalformedUserDataError", {}, HttpApiSchema.annotations({ status: 400 })) {}

export class UnauthorizedError extends Schema.TaggedError<UnauthorizedError>(
  "UnauthorizedError",
)("UnauthorizedError", {}, HttpApiSchema.annotations({ status: 403 })) {}

export class UserGroup extends HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.get("login", "/login")
      .setUrlParams(UserLoginPayload)
      .addError(MalformedUserDataError)
      .addSuccess(User),
  )
  .add(
    HttpApiEndpoint.get("me", "/me")
      .addError(UnauthorizedError)
      .addSuccess(User),
  )
  .prefix("/user") {}
