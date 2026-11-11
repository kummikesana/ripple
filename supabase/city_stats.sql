-- City stats: anonymized, aggregate-only community numbers per city.
--
-- No individual identifiers live here at all, not even an anonymous user id:
-- every log just adds its numbers to its city's running totals. There is no
-- way to tell from this table who logged what, or even how many distinct
-- people contributed, only how many choices and how much impact a city has
-- logged together. Run this once in the Supabase SQL editor (mirrors the
-- existing global_stats / increment_global_stats setup).

create table if not exists city_stats (
  city_key text primary key,
  city text not null,
  country text,
  total_logs bigint not null default 0,
  total_co2 numeric not null default 0,
  total_plastic numeric not null default 0,
  total_water numeric not null default 0,
  total_kwh numeric not null default 0,
  total_eur numeric not null default 0,
  updated_at timestamptz not null default now()
);

alter table city_stats enable row level security;

drop policy if exists "city stats are readable by anyone" on city_stats;
create policy "city stats are readable by anyone"
  on city_stats for select
  using (true);

-- No insert/update/delete policy for anon: every write goes through the
-- SECURITY DEFINER function below, which only ever adds to the running
-- totals for a city, it cannot be used to read or change anything else.

create or replace function increment_city_stats(
  p_city text,
  p_country text,
  p_co2 numeric default 0,
  p_plastic numeric default 0,
  p_water numeric default 0,
  p_kwh numeric default 0,
  p_eur numeric default 0
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  k text := lower(trim(p_city)) || '|' || lower(trim(coalesce(p_country, '')));
begin
  if p_city is null or trim(p_city) = '' then
    return;
  end if;

  insert into city_stats (city_key, city, country, total_logs, total_co2, total_plastic, total_water, total_kwh, total_eur, updated_at)
  values (k, p_city, p_country, 1, p_co2, p_plastic, p_water, p_kwh, p_eur, now())
  on conflict (city_key) do update set
    total_logs = city_stats.total_logs + 1,
    total_co2 = city_stats.total_co2 + excluded.total_co2,
    total_plastic = city_stats.total_plastic + excluded.total_plastic,
    total_water = city_stats.total_water + excluded.total_water,
    total_kwh = city_stats.total_kwh + excluded.total_kwh,
    total_eur = city_stats.total_eur + excluded.total_eur,
    updated_at = now();
end;
$$;

grant execute on function increment_city_stats(text, text, numeric, numeric, numeric, numeric, numeric) to anon;
