import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// 최근 생성된 로고 목록 조회 API
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("logos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ logos: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "로고 목록을 불러올 수 없습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
