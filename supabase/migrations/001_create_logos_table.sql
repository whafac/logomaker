-- 로고 메이커 Supabase 마이그레이션
-- Supabase Dashboard > SQL Editor에서 실행하거나 supabase CLI로 적용

-- 로고 기록 테이블
CREATE TABLE IF NOT EXISTS logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  logo_type TEXT NOT NULL,
  style TEXT NOT NULL,
  colors TEXT[] NOT NULL DEFAULT '{}',
  industry TEXT,
  keywords TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 최신순 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_logos_created_at ON logos(created_at DESC);

-- Row Level Security 활성화
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;

-- 익명 사용자도 로고 생성/조회 가능 (데모용 정책)
CREATE POLICY "Anyone can insert logos"
  ON logos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read logos"
  ON logos FOR SELECT
  USING (true);

-- Storage 버킷 생성 (Supabase Dashboard에서도 가능)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 공개 읽기 정책
CREATE POLICY "Public logo images are viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

-- Storage 업로드 정책 (서비스 롤 또는 anon)
CREATE POLICY "Anyone can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos');
