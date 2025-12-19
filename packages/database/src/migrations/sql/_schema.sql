\restrict 81EiQZXGW3RECw1JL8MbwGvYPpDAvAff9BF7As4vsLdPMOcUNmTagzahdZ6P3OG

COMMENT ON SCHEMA public IS '';

CREATE SCHEMA public3;

COMMENT ON SCHEMA public3 IS 'standard public schema';

CREATE FUNCTION public.update_categories_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$;

CREATE FUNCTION public.update_spendings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$;

CREATE FUNCTION public3.update_categories_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$;

CREATE FUNCTION public3.update_spendings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$;

CREATE TABLE public.categories (
    id uuid DEFAULT uuidv7() NOT NULL,
    name text NOT NULL,
    emoji text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.effect_sql_migrations (
    migration_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);

CREATE TABLE public.spendings (
    id uuid DEFAULT uuidv7() NOT NULL,
    amount real NOT NULL,
    description text,
    category_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public3.categories (
    id uuid DEFAULT uuidv7() NOT NULL,
    name text NOT NULL,
    emoji text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public3.effect_sql_migrations (
    migration_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);

CREATE TABLE public3.spendings (
    id uuid DEFAULT uuidv7() NOT NULL,
    amount real NOT NULL,
    description text,
    category_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.effect_sql_migrations
    ADD CONSTRAINT effect_sql_migrations_pkey PRIMARY KEY (migration_id);

ALTER TABLE ONLY public.spendings
    ADD CONSTRAINT spendings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public3.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public3.effect_sql_migrations
    ADD CONSTRAINT effect_sql_migrations_pkey PRIMARY KEY (migration_id);

ALTER TABLE ONLY public3.spendings
    ADD CONSTRAINT spendings_pkey PRIMARY KEY (id);

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_categories_updated_at();

CREATE TRIGGER update_spendings_updated_at BEFORE UPDATE ON public.spendings FOR EACH ROW EXECUTE FUNCTION public.update_spendings_updated_at();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public3.categories FOR EACH ROW EXECUTE FUNCTION public3.update_categories_updated_at();

CREATE TRIGGER update_spendings_updated_at BEFORE UPDATE ON public3.spendings FOR EACH ROW EXECUTE FUNCTION public3.update_spendings_updated_at();

ALTER TABLE ONLY public.spendings
    ADD CONSTRAINT spendings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE ONLY public3.spendings
    ADD CONSTRAINT spendings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public3.categories(id);

\unrestrict 81EiQZXGW3RECw1JL8MbwGvYPpDAvAff9BF7As4vsLdPMOcUNmTagzahdZ6P3OG

\restrict 0BINFNBXAPVR40SAZo7RF4RxlAJdtEhmFtS75nqYOVcTdSEYZbzHB1mDQBkY573

INSERT INTO public.effect_sql_migrations (migration_id, created_at, name) VALUES (1, '2025-12-17 18:30:40.847685+00', 'create-categories-table');
INSERT INTO public.effect_sql_migrations (migration_id, created_at, name) VALUES (2, '2025-12-17 18:30:40.847685+00', 'create-spendings-table');

\unrestrict 0BINFNBXAPVR40SAZo7RF4RxlAJdtEhmFtS75nqYOVcTdSEYZbzHB1mDQBkY573