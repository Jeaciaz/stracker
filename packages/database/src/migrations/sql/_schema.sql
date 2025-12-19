\restrict CghCGmuFO6HNM66L3yZfVqggg7upWR8e7JYZViwjc6694UKneSCXtKQHrzVr4wP

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

CREATE FUNCTION public.update_users_updated_at() RETURNS trigger
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

CREATE TABLE public.users (
    id uuid DEFAULT uuidv7() NOT NULL,
    tg_id text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    username text NOT NULL,
    photo_url text,
    auth_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.effect_sql_migrations
    ADD CONSTRAINT effect_sql_migrations_pkey PRIMARY KEY (migration_id);

ALTER TABLE ONLY public.spendings
    ADD CONSTRAINT spendings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_categories_updated_at();

CREATE TRIGGER update_spendings_updated_at BEFORE UPDATE ON public.spendings FOR EACH ROW EXECUTE FUNCTION public.update_spendings_updated_at();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_users_updated_at();

ALTER TABLE ONLY public.spendings
    ADD CONSTRAINT spendings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);

\unrestrict CghCGmuFO6HNM66L3yZfVqggg7upWR8e7JYZViwjc6694UKneSCXtKQHrzVr4wP

\restrict beblGiiOLJ5wEAVJJQMNuvpXHV2bJY0e4BePTEIFmucsrkDg3jpdyQAQmPHVi5q

INSERT INTO public.effect_sql_migrations (migration_id, created_at, name) VALUES (1, '2025-10-31 16:08:38.627012+00', 'create-categories-table');
INSERT INTO public.effect_sql_migrations (migration_id, created_at, name) VALUES (2, '2025-10-31 16:08:38.627012+00', 'create-spendings-table');
INSERT INTO public.effect_sql_migrations (migration_id, created_at, name) VALUES (3, '2025-12-19 16:31:07.092364+00', 'create-users-table');

\unrestrict beblGiiOLJ5wEAVJJQMNuvpXHV2bJY0e4BePTEIFmucsrkDg3jpdyQAQmPHVi5q