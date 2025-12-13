import { SqlClient } from "@effect/sql";
import { Effect } from "effect";

export default Effect.flatMap(
  SqlClient.SqlClient,
  (sql) => sql`
    create table categories (
      id uuid primary key default uuidv7(),
      name text not null,
      emoji text not null,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );

    create or replace function update_categories_updated_at () returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language plpgsql;

    create trigger update_categories_updated_at
      before update on categories
      for each row
      execute procedure update_categories_updated_at();
  `,
);
