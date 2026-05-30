import { NextRequest, NextResponse } from "next/server";
import { buildLogoPrompt } from "@/lib/prompt";
import { generateLogoImage } from "@/lib/openai";
import { uploadLogoToStorage } from "@/lib/storage";
import { createServerSupabaseClient } from "@/lib/supabase";
import { LogoFormData } from "@/types/logo";

// 로고 생성 API
export async function POST(request: NextRequest) {
  try {
    const body: LogoFormData = await request.json();

    // 필수 필드 검증
    if (!body.brandName?.trim()) {
      return NextResponse.json(
        { error: "브랜드 이름을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!body.logoType || !body.style) {
      return NextResponse.json(
        { error: "로고 유형과 스타일을 선택해주세요." },
        { status: 400 }
      );
    }

    if (!body.colors?.length) {
      return NextResponse.json(
        { error: "색상을 선택해주세요." },
        { status: 400 }
      );
    }

    // AI 프롬프트 생성 및 이미지 생성
    const prompt = buildLogoPrompt(body);
    const imageBuffer = await generateLogoImage(prompt);

    // Supabase Storage에 영구 저장
    let imageUrl: string;
    try {
      imageUrl = await uploadLogoToStorage(imageBuffer, body.brandName);
    } catch (storageError) {
      // Storage 실패 시 base64 data URL로 fallback
      console.warn("Storage upload failed, using data URL:", storageError);
      imageUrl = `data:image/png;base64,${imageBuffer.toString("base64")}`;
    }

    // DB에 로고 기록 저장
    let savedLogo = null;
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("logos")
        .insert({
          brand_name: body.brandName.trim(),
          logo_type: body.logoType,
          style: body.style,
          colors: body.colors,
          industry: body.industry || null,
          keywords: body.keywords || null,
          description: body.description || null,
          image_url: imageUrl,
          prompt,
        })
        .select()
        .single();

      if (error) {
        console.warn("DB save failed:", error.message);
      } else {
        savedLogo = data;
      }
    } catch (dbError) {
      console.warn("DB connection failed:", dbError);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      logo: savedLogo,
    });
  } catch (error) {
    console.error("Logo generation error:", error);

    const message =
      error instanceof Error ? error.message : "로고 생성 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
