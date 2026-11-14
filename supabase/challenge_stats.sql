-- Challenge stats: how many people have joined each challenge, nothing more.
--
-- Same spirit as city_stats.sql: anonymized, aggregate-only, no per-person id
-- stored anywhere. A join only ever increments one counter for that
-- challenge; there's no way to tell from this table who joined what. Run
-- this once in the Supabase SQL editor.

create table if not exists challenge_stats (
  challenge_id text primary key,
  joined_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table challenge_stats enable row level security;

drop policy if exists "challenge stats are readable by anyone" on challenge_stats;
create policy "challenge stats are readable by anyone"
  on challenge_stats for select
  using (true);

-- No insert/update/delete policy for anon: every write goes through the
-- SECURITY DEFINER function below, which only ever adds 1 to a challenge's
-- running total, it cannot be used to read or change anything else.

create or replace function join_challenge(p_challenge_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_challenge_id is null or trim(p_challenge_id) = '' then
    return;
  end if;

  insert into challenge_stats (challenge_id, joined_count, updated_at)
  values (p_challenge_id, 1, now())
  on conflict (challenge_id) do update set
    joined_count = challenge_stats.joined_count + 1,
    updated_at = now();
end;
$$;

grant execute on function join_challenge(text) to anon;
