
-- 1. Create the favorites table if it doesn't exist
create table if not exists favorites (
  user_id uuid references auth.users not null,
  movie_id text not null,
  movie_data jsonb,
  created_at timestamptz default now(),
  primary key (user_id, movie_id)
);

-- 2. Enable RLS
alter table favorites enable row level security;

-- 3. Create policies (drop existing ones first to avoid errors if re-running)
drop policy if exists "Users can view their own favorites" on favorites;
create policy "Users can view their own favorites"
  on favorites for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can add their own favorites" on favorites;
create policy "Users can add their own favorites"
  on favorites for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can remove their own favorites" on favorites;
create policy "Users can remove their own favorites"
  on favorites for delete
  using ( auth.uid() = user_id );
