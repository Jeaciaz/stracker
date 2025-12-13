import { SqlClient } from "@effect/sql";
import { Effect } from "effect";

export default Effect.flatMap(
  SqlClient.SqlClient,
  (sql) => sql`
    create table spendings (
      id uuid primary key default uuidv7(),
      amount real not null,
      description text,
      category_id uuid not null references categories(id),
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );

    create or replace function update_spendings_updated_at () returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language plpgsql;

    create trigger update_spendings_updated_at
      before update on spendings
      for each row
      execute procedure update_spendings_updated_at();
  `,
);
