-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. THEATERS TABLE
create table theaters (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  location text not null,
  facilities text[], -- e.g., ['Dolby Atmos', 'IMAX']
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. MOVIES CACHE TABLE (To link with showtimes)
create table movies (
  id uuid default uuid_generate_v4() primary key,
  omdb_id text unique not null,
  title text not null,
  poster_path text,
  backdrop_path text,
  genres text[],
  runtime int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SHOWTIMES TABLE
create table showtimes (
  id uuid default uuid_generate_v4() primary key,
  theater_id uuid references theaters(id) on delete cascade not null,
  movie_id uuid references movies(id) on delete cascade not null,
  show_time timestamp with time zone not null,
  screen_number text,
  price_standard int default 250,
  price_vip int default 400,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. BOOKINGS TABLE
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  showtime_id uuid references showtimes(id) not null,
  seats text[] not null, -- Array of seat IDs e.g. ['A1', 'A2']
  total_price int not null,
  status text default 'confirmed', -- confirmed, cancelled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table theaters enable row level security;
alter table movies enable row level security;
alter table showtimes enable row level security;
alter table bookings enable row level security;

-- Public read access
create policy "Public theaters are viewable by everyone" on theaters for select using (true);
create policy "Public movies are viewable by everyone" on movies for select using (true);
create policy "Public showtimes are viewable by everyone" on showtimes for select using (true);

-- User specific booking access
create policy "Users can view their own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can insert their own bookings" on bookings for insert with check (auth.uid() = user_id);

-- SEED DATA (DUMMY DATA FOR TESTING)
-- Insert Theaters
insert into theaters (name, location, facilities) values 
('PVR Cinemas', 'Downtown Mall', ARRAY['Dolby Atmos', '4K Projection']),
('INOX Movies', 'City Center', ARRAY['IMAX', 'Recliners']);

-- Assuming we will insert movies dynamically, but let's insert a placeholder if you want to test immediately.
-- For now, the app will need to handle "syncing" OMDb info to the movies table when a user views a movie, or we just insert one for the demo.
