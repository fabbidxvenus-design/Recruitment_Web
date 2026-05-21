create extension if not exists pgcrypto;

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_vi text not null,
  title_jp text,
  summary_vi text not null,
  summary_jp text,
  description_vi text not null,
  description_jp text,
  department text,
  location text not null,
  employment_type text not null,
  experience_level text,
  salary_range text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  seo_title_vi text,
  seo_title_jp text,
  seo_description_vi text,
  seo_description_jp text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_vi text not null,
  title_jp text,
  excerpt_vi text not null,
  excerpt_jp text,
  body_vi text not null,
  body_jp text,
  cover_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  seo_title_vi text,
  seo_title_jp text,
  seo_description_vi text,
  seo_description_jp text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id),
  target_position text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  years_of_experience numeric,
  portfolio_url text,
  cover_letter text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'shortlisted', 'rejected', 'archived')),
  notification_status text not null default 'pending' check (notification_status in ('pending', 'sent', 'failed')),
  notification_error text,
  retention_expires_at timestamptz not null default (now() + interval '6 months'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cv_files (
  id uuid primary key default gen_random_uuid(),
  application_id uuid unique not null references public.applications(id) on delete cascade,
  bucket text not null default 'candidate-cvs',
  object_path text not null,
  original_filename text not null,
  mime_type text not null check (mime_type = 'application/pdf'),
  size_bytes integer not null check (size_bytes <= 5242880),
  created_at timestamptz not null default now(),
  constraint cv_files_no_public_url check (object_path not like 'http%')
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  hr_notification_email text not null,
  default_locale text not null default 'vi',
  site_name text not null default 'Fabbi Careers',
  seo_title_vi text,
  seo_title_jp text,
  seo_description_vi text,
  seo_description_jp text,
  social_links jsonb not null default '{}'::jsonb,
  cv_policy_text_vi text not null default 'CV được lưu trữ riêng tư và chỉ HR/Admin được truy cập.',
  cv_policy_text_jp text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  email text not null,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_login_attempts (
  client_key text primary key,
  attempt_count integer not null default 0,
  reset_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;
alter table public.news enable row level security;
alter table public.applications enable row level security;
alter table public.cv_files enable row level security;
alter table public.settings enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.admin_login_attempts enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('candidate-cvs', 'candidate-cvs', false, 5242880, array['application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['application/pdf'];

drop policy if exists "admin read candidate cvs" on storage.objects;
create policy "admin read candidate cvs" on storage.objects for select using (bucket_id = 'candidate-cvs' and exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin delete candidate cvs" on storage.objects;
create policy "admin delete candidate cvs" on storage.objects for delete using (bucket_id = 'candidate-cvs' and exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "public read published jobs" on public.jobs;
create policy "public read published jobs" on public.jobs for select using (status = 'published');

drop policy if exists "public read published news" on public.news;
create policy "public read published news" on public.news for select using (status = 'published');

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);

drop policy if exists "admin manage jobs" on public.jobs;
create policy "admin manage jobs" on public.jobs for all using (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin manage news" on public.news;
create policy "admin manage news" on public.news for all using (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin read applications" on public.applications;
create policy "admin read applications" on public.applications for select using (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin update applications" on public.applications;
create policy "admin update applications" on public.applications for update using (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin read cv files" on public.cv_files;
create policy "admin read cv files" on public.cv_files for select using (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin insert cv files" on public.cv_files;
create policy "admin insert cv files" on public.cv_files for insert with check (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin delete cv files" on public.cv_files;
create policy "admin delete cv files" on public.cv_files for delete using (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin manage settings" on public.settings;
create policy "admin manage settings" on public.settings for all using (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

drop policy if exists "admin manage admin profiles" on public.admin_profiles;
create policy "admin manage admin profiles" on public.admin_profiles for all using (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin'));

insert into public.settings (hr_notification_email, site_name, seo_title_vi, seo_title_jp, seo_description_vi, seo_description_jp)
values ('hr@example.com', 'Fabbi Careers', 'Tuyển dụng Fabbi', 'Fabbi採用', 'Cơ hội nghề nghiệp tại Fabbi.', 'Fabbiの採用情報。')
on conflict do nothing;

insert into public.jobs (slug, title_vi, title_jp, summary_vi, summary_jp, description_vi, description_jp, department, location, employment_type, salary_range, tags, status, published_at)
values
  ('full-stack-engineer', 'Full Stack Engineer', 'フルスタックエンジニア', 'Phát triển sản phẩm web quy mô lớn.', '大規模Webプロダクトを開発します。', 'Tham gia thiết kế và phát triển hệ thống web.', 'Webシステムの設計と開発に参加します。', 'Engineering', 'Hà Nội', 'Full Time', 'Thương lượng', array['React','Node.js','Cloud'], 'published', now()),
  ('frontend-engineer', 'Frontend Engineer', 'フロントエンドエンジニア', 'Xây dựng giao diện tuyển dụng và CMS.', '採用サイトとCMS UIを構築します。', 'Tập trung vào UI fidelity và accessibility.', 'UI再現性とアクセシビリティに注力します。', 'Frontend', 'Đà Nẵng', 'Full Time', 'Up to 2000 USD', array['Frontend','TypeScript','UI'], 'published', now())
on conflict (slug) do nothing;

insert into public.news (slug, title_vi, title_jp, excerpt_vi, excerpt_jp, body_vi, body_jp, status, published_at)
values
  ('fabbi-strong-up', 'Fabbi Strong Up', 'Fabbi Strong Up', 'Hoạt động kết nối đội ngũ Fabbi.', 'Fabbiチームをつなぐ活動。', 'Fabbi Strong Up là chuỗi hoạt động nội bộ.', 'Fabbi Strong Upは社内活動です。', 'published', now()),
  ('engineering-culture', 'Văn hóa kỹ thuật tại Fabbi', 'Fabbiのエンジニアリング文化', 'Môi trường học hỏi và cải tiến.', '学びと改善の環境。', 'Văn hóa kỹ thuật bắt đầu từ sự rõ ràng.', '技術文化は明確さから始まります。', 'published', now())
on conflict (slug) do nothing;
