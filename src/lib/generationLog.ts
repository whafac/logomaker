import { createServerSupabaseClient } from "./supabase";

export interface GenerationRunInput {
  kind: "concepts" | "generate";
  brandName: string;
  model: string;
  promptSummary: string;
  conceptId?: string | null;
  success: boolean;
  errorMessage?: string | null;
  durationMs: number;
  costUsd?: number | null;
  usageTotalTokens?: number | null;
}

// 요청별 비용·처리시간 기록 (테이블 없으면 무시)
export async function logGenerationRun(input: GenerationRunInput): Promise<void> {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("generation_runs").insert({
      kind: input.kind,
      brand_name: input.brandName,
      model: input.model,
      prompt_summary: input.promptSummary.slice(0, 2000),
      concept_id: input.conceptId ?? null,
      success: input.success,
      error_message: input.errorMessage ?? null,
      duration_ms: input.durationMs,
      cost_usd: input.costUsd ?? null,
      usage_total_tokens: input.usageTotalTokens ?? null,
    });

    if (error) {
      console.warn("generation_runs insert failed:", error.message);
    }
  } catch (error) {
    console.warn("generation_runs logging skipped:", error);
  }
}
