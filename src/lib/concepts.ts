import { createOpenAIClient } from "./openai";
import { LogoConcept, LogoFormData } from "@/types/logo";

const CONCEPT_MODEL = "gpt-4o-mini";

export function getConceptModel(): string {
  return CONCEPT_MODEL;
}

// 사용자 입력을 콘셉트 제안용 브리프 텍스트로 정리
export function buildDesignBrief(data: LogoFormData): string {
  const displayName = data.brandNameExact.trim() || data.brandName.trim();
  const lines = [
    `브랜드명: ${data.brandName.trim()}`,
    `정확한 표기: ${displayName}`,
    `업종: ${data.industry}`,
    `로고 유형: ${data.logoType}`,
    `선호 스타일: ${data.style}`,
    `키워드: ${data.keywords}`,
    `무드: ${data.moods.join(", ")}`,
    `색상: ${data.colors.join(", ")}`,
  ];

  if (data.targetAudience.trim()) {
    lines.push(`주요 고객: ${data.targetAudience.trim()}`);
  }
  if (data.coreValues.trim()) {
    lines.push(`핵심 가치: ${data.coreValues.trim()}`);
  }
  if (data.usageMedia.length > 0) {
    lines.push(`사용 매체: ${data.usageMedia.join(", ")}`);
  }
  if (data.symbolMetaphor.trim()) {
    lines.push(`상징/메타포: ${data.symbolMetaphor.trim()}`);
  }
  if (data.avoidStyles.length > 0) {
    lines.push(`피할 느낌: ${data.avoidStyles.join(", ")}`);
  }
  if (data.description.trim()) {
    lines.push(`추가 요청: ${data.description.trim()}`);
  }
  if (data.symbolTextSeparate && data.logoType !== "wordmark") {
    lines.push("생성 방식: 심볼만 생성 후 브랜드명은 별도 텍스트로 조합");
  }

  return lines.join("\n");
}

function parseConceptsJson(raw: string): LogoConcept[] {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  const parsed = JSON.parse(cleaned) as { concepts?: unknown };

  if (!Array.isArray(parsed.concepts) || parsed.concepts.length < 3) {
    throw new Error("콘셉트 응답 형식이 올바르지 않습니다.");
  }

  return parsed.concepts.slice(0, 3).map((item, index) => {
    const concept = item as Partial<LogoConcept>;
    if (
      typeof concept.title !== "string" ||
      typeof concept.coreIdea !== "string" ||
      typeof concept.symbolStructure !== "string" ||
      typeof concept.typographyDirection !== "string" ||
      typeof concept.colorRationale !== "string" ||
      typeof concept.differentiation !== "string"
    ) {
      throw new Error("콘셉트 필드가 누락되었습니다.");
    }

    return {
      id: typeof concept.id === "string" && concept.id ? concept.id : `concept-${index + 1}`,
      title: concept.title.trim(),
      coreIdea: concept.coreIdea.trim(),
      symbolStructure: concept.symbolStructure.trim(),
      typographyDirection: concept.typographyDirection.trim(),
      colorRationale: concept.colorRationale.trim(),
      differentiation: concept.differentiation.trim(),
    };
  });
}

// 서로 다른 디자인 방향 3안을 텍스트 모델로 제안
export async function generateLogoConcepts(
  data: LogoFormData
): Promise<{ concepts: LogoConcept[]; brief: string; model: string }> {
  const openai = createOpenAIClient();
  const brief = buildDesignBrief(data);
  const symbolOnlyNote =
    data.symbolTextSeparate && data.logoType !== "wordmark"
      ? "Symbol-only mark concepts (no lettering in the mark). Typography direction should describe how brand name will be paired later."
      : "Include typography direction for any lettering that appears in the logo.";

  const response = await openai.chat.completions.create({
    model: CONCEPT_MODEL,
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior brand designer. Propose exactly 3 distinct logo concepts for the brief.
Rules:
- Concepts must differ in core idea, symbol structure, and typography direction — not just color swaps.
- Do not copy existing famous logos.
- Write all concept fields in Korean.
- ${symbolOnlyNote}
- Return JSON: {"concepts":[{"id":"c1","title":"","coreIdea":"","symbolStructure":"","typographyDirection":"","colorRationale":"","differentiation":""}]}`,
      },
      {
        role: "user",
        content: brief,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("콘셉트 생성에 실패했습니다.");
  }

  return {
    concepts: parseConceptsJson(content),
    brief,
    model: CONCEPT_MODEL,
  };
}
