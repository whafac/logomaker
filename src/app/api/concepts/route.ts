import { NextRequest, NextResponse } from "next/server";
import { generateLogoConcepts } from "@/lib/concepts";
import { logGenerationRun } from "@/lib/generationLog";
import {
  checkRateLimit,
  releaseInflight,
  tryAcquireInflight,
} from "@/lib/rateLimit";
import { parseReferenceImages } from "@/lib/referenceImage";
import { LogoFormData, isKeywordsValid } from "@/types/logo";

function validateBriefInput(body: LogoFormData): string | null {
  if (!body.brandName?.trim()) return "브랜드 이름을 입력해주세요.";
  if (!body.logoType || !body.style) {
    return "로고 유형과 스타일을 선택해주세요.";
  }
  if (!body.industry) return "업종을 선택해주세요.";
  if (!isKeywordsValid(body.keywords)) {
    return "키워드를 2개 이상 입력해주세요.";
  }
  if (!body.moods?.length) return "브랜드 무드를 1개 이상 선택해주세요.";
  if (!body.colors?.length) return "색상을 선택해주세요.";
  return null;
}

// 디자인 콘셉트 3안 제안 API
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  let brandName = "";

  const rate = checkRateLimit(request, "concepts", 8, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: `요청이 너무 많습니다. ${rate.retryAfterSec}초 후 다시 시도해 주세요.`,
      },
      { status: 429 }
    );
  }

  if (!tryAcquireInflight(request, "concepts")) {
    return NextResponse.json(
      { error: "이미 콘셉트 제안을 진행 중입니다. 잠시만 기다려 주세요." },
      { status: 409 }
    );
  }

  try {
    const body = (await request.json()) as LogoFormData;
    brandName = body.brandName?.trim() || "";

    try {
      body.referenceImages = parseReferenceImages(body.referenceImages);
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

    const validationError = validateBriefInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // 정확한 표기가 비어 있으면 브랜드명으로 채움
    if (!body.brandNameExact?.trim()) {
      body.brandNameExact = body.brandName.trim();
    }

    const { concepts, brief, model } = await generateLogoConcepts(body);

    await logGenerationRun({
      kind: "concepts",
      brandName,
      model,
      promptSummary: brief,
      success: true,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({
      success: true,
      brief,
      concepts,
      model,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("Concept generation error:", error);
    const message =
      error instanceof Error ? error.message : "콘셉트 제안에 실패했습니다.";

    await logGenerationRun({
      kind: "concepts",
      brandName: brandName || "unknown",
      model: "gpt-4o-mini",
      promptSummary: "",
      success: false,
      errorMessage: message,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    releaseInflight(request, "concepts");
  }
}
