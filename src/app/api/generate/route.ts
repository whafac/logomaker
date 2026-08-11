import { NextRequest, NextResponse } from "next/server";
import { buildLogoPrompt } from "@/lib/prompt";
import { generateLogoImage } from "@/lib/openai";
import { uploadLogoToStorage } from "@/lib/storage";
import { createServerSupabaseClient } from "@/lib/supabase";
import { calculateImageCost } from "@/lib/cost";
import { convertPngToSvg } from "@/lib/vectorize";
import { LogoFormData, isKeywordsValid } from "@/types/logo";
import { parseReferenceImages } from "@/lib/referenceImage";

// 로고 생성 API
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LogoFormData;

    let referenceImages;
    try {
      referenceImages = parseReferenceImages(body.referenceImages);
    } catch (parseError) {
      return NextResponse.json(
        {
          error:
            parseError instanceof Error
              ? parseError.message
              : "참고 이미지를 확인하지 못했습니다.",
        },
        { status: 400 }
      );
    }

    body.referenceImages = referenceImages;

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

    if (!body.industry) {
      return NextResponse.json(
        { error: "업종을 선택해주세요." },
        { status: 400 }
      );
    }

    if (!isKeywordsValid(body.keywords)) {
      return NextResponse.json(
        { error: "키워드를 2개 이상 입력해주세요." },
        { status: 400 }
      );
    }

    if (!body.moods?.length) {
      return NextResponse.json(
        { error: "브랜드 무드를 1개 이상 선택해주세요." },
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
    const { buffer: imageBuffer, usage } = await generateLogoImage(
      prompt,
      referenceImages
    );
    const cost = calculateImageCost(usage, "medium", "1024x1024");

    // PNG → SVG 벡터 변환 (추가 API 비용 없음)
    let svg: string | null = null;
    try {
      svg = await convertPngToSvg(imageBuffer);
    } catch (svgError) {
      console.warn("SVG conversion failed:", svgError);
    }

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
      usage,
      cost,
      svg,
    });
  } catch (error) {
    console.error("Logo generation error:", error);

    const message =
      error instanceof Error ? error.message : "로고 생성 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
