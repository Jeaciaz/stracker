import { SqlClient } from "@effect/sql";
import { Effect } from "effect";

export default Effect.flatMap(
  SqlClient.SqlClient,
  (sql) => sql`
    create table users (
      id text primary key default uuidv7(),
      tg_id text not null,
      first_name text not null,
      last_name text,
      username text not null,
      photo_url text,
      auth_date timestamp with time zone,

      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );

    create or replace function update_users_updated_at () returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language plpgsql;

    create trigger update_users_updated_at
      before update on users
      for each row
      execute procedure update_users_updated_at();
  `,
);
