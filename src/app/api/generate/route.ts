import { NextRequest, NextResponse } from "next/server";
import { buildLogoPrompt } from "@/lib/prompt";
import { generateLogoImage } from "@/lib/openai";
import { uploadLogoToStorage } from "@/lib/storage";
import { createServerSupabaseClient } from "@/lib/supabase";
import { calculateImageCost } from "@/lib/cost";
import { convertPngToSvg } from "@/lib/vectorize";
import { LogoConcept, LogoFormData, isKeywordsValid } from "@/types/logo";
import { parseReferenceImages } from "@/lib/referenceImage";
import { logGenerationRun } from "@/lib/generationLog";
import {
  checkRateLimit,
  releaseInflight,
  tryAcquireInflight,
} from "@/lib/rateLimit";

interface GenerateRequestBody extends LogoFormData {
  selectedConcept?: LogoConcept | null;
}

function parseSelectedConcept(value: unknown): LogoConcept | null {
  if (value == null) return null;
  if (!value || typeof value !== "object") {
    throw new Error("선택한 콘셉트 형식이 올바르지 않습니다.");
  }

  const concept = value as Partial<LogoConcept>;
  if (
    typeof concept.id !== "string" ||
    typeof concept.title !== "string" ||
    typeof concept.coreIdea !== "string" ||
    typeof concept.symbolStructure !== "string" ||
    typeof concept.typographyDirection !== "string" ||
    typeof concept.colorRationale !== "string" ||
    typeof concept.differentiation !== "string"
  ) {
    throw new Error("선택한 콘셉트 정보가 불완전합니다.");
  }

  return {
    id: concept.id,
    title: concept.title,
    coreIdea: concept.coreIdea,
    symbolStructure: concept.symbolStructure,
    typographyDirection: concept.typographyDirection,
    colorRationale: concept.colorRationale,
    differentiation: concept.differentiation,
  };
}

// 로고 생성 API
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  let brandName = "";
  let conceptId: string | null = null;

  const rate = checkRateLimit(request, "generate", 5, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: `생성 요청이 너무 많습니다. ${rate.retryAfterSec}초 후 다시 시도해 주세요.`,
      },
      { status: 429 }
    );
  }

  if (!tryAcquireInflight(request, "generate")) {
    return NextResponse.json(
      { error: "이미 로고를 생성 중입니다. 잠시만 기다려 주세요." },
      { status: 409 }
    );
  }

  try {
    const body = (await request.json()) as GenerateRequestBody;
    brandName = body.brandName?.trim() || "";

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

    let selectedConcept: LogoConcept | null = null;
    try {
      selectedConcept = parseSelectedConcept(body.selectedConcept);
    } catch (conceptError) {
      return NextResponse.json(
        {
          error:
            conceptError instanceof Error
              ? conceptError.message
              : "콘셉트를 확인하지 못했습니다.",
        },
        { status: 400 }
      );
    }

    if (!selectedConcept) {
      return NextResponse.json(
        { error: "디자인 콘셉트를 선택한 뒤 생성해 주세요." },
        { status: 400 }
      );
    }
    conceptId = selectedConcept.id;

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

    if (!body.brandNameExact?.trim()) {
      body.brandNameExact = body.brandName.trim();
    }

    const symbolOnly =
      Boolean(body.symbolTextSeparate) && body.logoType !== "wordmark";

    // AI 프롬프트 생성 및 이미지 생성
    const prompt = buildLogoPrompt(body, {
      concept: selectedConcept,
      symbolOnly,
    });
    const { buffer: imageBuffer, usage } = await generateLogoImage(
      prompt,
      referenceImages
    );
    const cost = calculateImageCost(usage, "medium", "1024x1024");

    // PNG → SVG 트레이싱 (원본 벡터 경로가 아님)
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

    const durationMs = Date.now() - startedAt;

    await logGenerationRun({
      kind: "generate",
      brandName,
      model: "gpt-image-1.5",
      promptSummary: prompt,
      conceptId,
      success: true,
      durationMs,
      costUsd: cost.usd,
      usageTotalTokens: usage.totalTokens,
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      logo: savedLogo,
      usage,
      cost,
      svg,
      symbolOnly,
      selectedConcept,
      durationMs,
      // 시안 PNG이며, SVG는 트레이싱 근사본
      assetKind: "logo-draft",
    });
  } catch (error) {
    console.error("Logo generation error:", error);

    const message =
      error instanceof Error ? error.message : "로고 생성 중 오류가 발생했습니다.";

    await logGenerationRun({
      kind: "generate",
      brandName: brandName || "unknown",
      model: "gpt-image-1.5",
      promptSummary: "",
      conceptId,
      success: false,
      errorMessage: message,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    releaseInflight(request, "generate");
  }
}
