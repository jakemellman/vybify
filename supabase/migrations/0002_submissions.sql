create table public.submissions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in ('project', 'skill')),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),

  -- content fields (mirror baseEntry from config.ts)
  name        text not null,
  tagline     text not null check (char_length(tagline) <= 160),
  url         text not null,
  github      text,
  tags        text[] not null default '{}',
  body        text,

  -- project-specific
  built_with  text[] not null default '{}',

  -- skill-specific
  kind        text check (kind is null or kind in ('claude-code-skill','mcp-server','cursor-rule','custom-gpt','other')),
  install     text,

  -- moderation
  reviewer_note text,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.submissions enable row level security;

-- Users can read their own submissions
create policy "users can read own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

-- Users can insert their own submissions
create policy "users can insert own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

-- Users can update their own pending submissions
create policy "users can update own pending submissions"
  on public.submissions for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');

-- Users can delete their own pending submissions
create policy "users can delete own pending submissions"
  on public.submissions for delete
  using (auth.uid() = user_id and status = 'pending');

-- Reuse the touch_updated_at function from profiles migration
create trigger submissions_touch_updated_at
  before update on public.submissions
  for each row execute function public.touch_updated_at();
