import { LogoFormData, LogoType, DesignStyle } from "@/types/logo";

// 로고 유형별 영문 설명 (AI 프롬프트용)
const LOGO_TYPE_PROMPTS: Record<LogoType, string> = {
  wordmark: "wordmark logo with stylized typography only, no separate icon",
  icon: "symbol/icon logo mark only, no text",
  combination: "combination logo with both a symbol icon and brand name text",
  emblem: "emblem/badge style logo with text integrated inside a shape",
};

// 디자인 스타일별 영문 설명 (AI 프롬프트용)
const STYLE_PROMPTS: Record<DesignStyle, string> = {
  minimal: "minimal, clean, simple design with lots of white space",
  modern: "modern, sleek, contemporary design",
  vintage: "vintage, retro, classic design with nostalgic feel",
  playful: "playful, friendly, fun and approachable design",
  corporate: "corporate, professional, trustworthy business design",
  luxury: "luxury, elegant, premium high-end design",
  tech: "tech, innovative, digital futuristic design",
  organic: "organic, natural, soft flowing shapes",
};

// 사용자 입력을 DALL-E 프롬프트로 변환
export function buildLogoPrompt(data: LogoFormData): string {
  const colorList = data.colors.join(", ");

  const parts = [
    `Professional logo design for brand "${data.brandName}"`,
    LOGO_TYPE_PROMPTS[data.logoType as LogoType],
    STYLE_PROMPTS[data.style as DesignStyle],
    `Color palette: ${colorList}`,
  ];

  if (data.industry) {
    parts.push(`Industry: ${data.industry}`);
  }

  if (data.keywords) {
    parts.push(`Keywords/concepts: ${data.keywords}`);
  }

  if (data.description) {
    parts.push(`Additional requirements: ${data.description}`);
  }

  parts.push(
    "Vector-style flat design, clean lines, professional branding, white or transparent background, high quality logo mark suitable for business use, no mockup, no 3D effects, no photorealistic elements"
  );

  return parts.join(". ");
}
