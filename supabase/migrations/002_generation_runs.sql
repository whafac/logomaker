-- 생성/콘셉트 요청 로그 (비용·처리시간)
CREATE TABLE IF NOT EXISTS generation_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('concepts', 'generate')),
  brand_name TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_summary TEXT NOT NULL DEFAULT '',
  concept_id TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC,
  usage_total_tokens INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_generation_runs_created_at
  ON generation_runs(created_at DESC);

ALTER TABLE generation_runs ENABLE ROW LEVEL SECURITY;

-- 서버(service role) 기록이 기본. 익명 조회는 막음
CREATE POLICY "Service can insert generation runs"
  ON generation_runs FOR INSERT
  WITH CHECK (true);
