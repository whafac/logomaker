import { LogoFormData, LogoType, DesignStyle, parseKeywords } from "@/types/logo";

// 로고 유형별 상세 영문 설명 (AI 프롬프트용)
const LOGO_TYPE_PROMPTS: Record<LogoType, string> = {
  wordmark:
    "distinctive custom wordmark typography with unique letter spacing and kerning, no generic font look, no separate icon",
  icon:
    "memorable standalone symbol mark, strong silhouette readable at small sizes, clever negative space, no text",
  combination:
    "balanced combination lockup with clear hierarchy between symbol and brand name text, harmonious spacing",
  emblem:
    "contained emblem or badge composition with integrated text inside a shape, seal-like framing",
};

// 디자인 스타일별 상세 영문 설명 (AI 프롬프트용)
const STYLE_PROMPTS: Record<DesignStyle, string> = {
  minimal:
    "minimal geometric design, generous whitespace, single focal element, restrained two-tone palette, Swiss design influence",
  modern:
    "modern premium branding, bold custom letterforms, crisp vector edges, subtle grid alignment, contemporary SaaS aesthetic",
  vintage:
    "vintage retro branding, serif typography hints, badge composition, classic emblem framing, nostalgic craft feel",
  playful:
    "playful friendly branding, rounded organic forms, bouncy proportions, approachable curves, warm personality",
  corporate:
    "corporate trustworthy branding, stable balanced composition, professional sans-serif, credible business identity",
  luxury:
    "luxury premium branding, thin elegant strokes, high contrast, editorial spacing, refined gold-accent sensibility",
  tech:
    "tech innovative branding, angular geometry, digital node or circuit-inspired curves, futuristic sans-serif, smart gradient accent on one element only",
  organic:
    "organic natural branding, soft flowing shapes, hand-crafted warmth, leaf or wave inspired curves, earthy harmony",
};

// 업종별 디자인 힌트 (AI 프롬프트용)
const INDUSTRY_HINTS: Record<string, string> = {
  "IT/테크":
    "SaaS or startup identity, geometric nodes, connectivity metaphor, sharp digital precision",
  "음식/카페":
    "hospitality warmth, cup or ingredient abstract symbol, artisan hand-crafted feel, inviting atmosphere",
  "패션/뷰티":
    "fashion editorial aesthetic, elegant thin strokes, high contrast, sophisticated layout",
  "교육":
    "learning and growth metaphor, book or light abstract symbol, approachable trustworthy tone",
  "건강/피트니스":
    "wellness vitality, balanced human motion metaphor, fresh energetic forms, natural harmony",
  "금융":
    "financial trust and stability, shield or growth arrow metaphor, conservative premium tone",
  "부동산":
    "real estate prestige, architectural line metaphor, solid stable geometry, premium property feel",
  "엔터테인먼트":
    "creative dynamic energy, bold expressive forms, memorable show-business personality",
  "기타": "versatile professional identity with distinctive character",
};

// 한글 키워드/무드를 영문 비주얼 메타포로 변환
const VISUAL_METAPHOR_MAP: Record<string, string> = {
  신뢰: "stable balanced geometry conveying trust",
  혁신: "forward-leaning forms suggesting innovation",
  따뜻함: "soft warm curves and approachable shapes",
  프리미엄: "refined high-end editorial spacing",
  친근함: "friendly rounded approachable proportions",
  대담함: "bold impactful strokes and strong contrast",
  세련됨: "sleek polished contemporary lines",
  자연스러움: "organic flowing natural forms",
  전문성: "precise clean professional structure",
  창의성: "unique clever visual concept with personality",
  성장: "upward motion and expansion metaphor",
  미래: "futuristic light accents and forward momentum",
  연결: "interlinked nodes or bridge metaphor",
  속도: "dynamic diagonal motion lines",
  데이터: "structured grid or pixel cluster metaphor",
  커피: "steam curl or bean abstract silhouette",
  향기: "soft rising wave curves",
  수제: "hand-crafted imperfect charm",
  커뮤니티: "interconnected circle motif",
  편안함: "soft pillow-like rounded forms",
  우아함: "graceful thin elegant curves",
  개성: "distinctive unconventional silhouette",
  트렌드: "contemporary fresh visual language",
  감각: "tasteful refined aesthetic balance",
  지식: "light bulb or open book abstract hint",
  영감: "radiating light burst metaphor",
  발전: "ascending steps or sprout metaphor",
  활력: "energetic burst and dynamic angles",
  균형: "symmetrical yin-yang balance",
  자연: "leaf or water ripple abstract form",
  웰빙: "harmonious calm circular flow",
  에너지: "radiating pulse lines",
  안정: "solid grounded rectangular base",
  보호: "shield or shelter arc metaphor",
  공간: "architectural frame or doorway symbol",
  가치: "diamond or gem abstract facet",
  즐거움: "playful bounce and cheerful curves",
  스토리: "narrative path or chapter mark metaphor",
};

// 피하고 싶은 스타일을 negative prompt 문장으로 변환
const AVOID_STYLE_MAP: Record<string, string> = {
  유치함: "childish cartoon aesthetics",
  복잡함: "overly complex cluttered details",
  "옛날 느낌": "outdated dated visual clichés",
  평범함: "generic stock icon look",
  어두움: "dark gloomy heavy atmosphere",
  날카로움: "aggressive sharp hostile edges",
};

// negative prompt (공통)
const NEGATIVE_PROMPT =
  "Avoid: generic clip art, stock icon look, overly complex details, blurry or misspelled text, gradient overload, 3D mockup presentation, watermark, busy background, low quality, duplicate elements";

// 색상 hex와 역할 설명 생성
function buildColorPrompt(colors: string[]): string {
  const [primary, secondary, accent] = colors;
  return `Color palette — primary ${primary} for main mark, secondary ${secondary} for typography or supporting elements, accent ${accent} for highlights only. Harmonious color application`;
}

// 키워드/무드를 비주얼 메타포 문장으로 변환
function buildVisualMetaphors(keywords: string[], moods: string[]): string {
  const terms = [...new Set([...keywords, ...moods])];
  const metaphors = terms
    .map((term) => VISUAL_METAPHOR_MAP[term])
    .filter(Boolean);

  if (metaphors.length === 0) {
    return `Brand concepts: ${terms.join(", ")}`;
  }

  return `Visual metaphors to express: ${metaphors.join("; ")}`;
}

// 피하고 싶은 스타일 문장 생성
function buildAvoidPrompt(avoidStyles: string[]): string | null {
  if (avoidStyles.length === 0) return null;

  const avoids = avoidStyles
    .map((style) => AVOID_STYLE_MAP[style])
    .filter(Boolean);

  if (avoids.length === 0) {
    return `Avoid these moods: ${avoidStyles.join(", ")}`;
  }

  return `Avoid: ${avoids.join(", ")}`;
}

// 사용자 입력을 gpt-image-1 프롬프트로 변환
export function buildLogoPrompt(data: LogoFormData): string {
  const keywords = parseKeywords(data.keywords);

  const parts = [
    `Award-worthy professional logo design for brand "${data.brandName}"`,
    LOGO_TYPE_PROMPTS[data.logoType as LogoType],
    STYLE_PROMPTS[data.style as DesignStyle],
    buildColorPrompt(data.colors),
  ];

  if (data.industry) {
    parts.push(`Industry context: ${data.industry}`);
    const industryHint = INDUSTRY_HINTS[data.industry];
    if (industryHint) {
      parts.push(industryHint);
    }
  }

  parts.push(buildVisualMetaphors(keywords, data.moods));

  if (data.symbolMetaphor.trim()) {
    parts.push(
      `Incorporate this symbol concept: ${data.symbolMetaphor.trim()}`
    );
  }

  if (data.description.trim()) {
    parts.push(`Additional creative direction: ${data.description.trim()}`);
  }

  const avoidPrompt = buildAvoidPrompt(data.avoidStyles);
  if (avoidPrompt) {
    parts.push(avoidPrompt);
  }

  parts.push(
    "Vector-style flat design, masterful use of negative space, distinctive memorable silhouette, scalable brand identity, white or transparent background, no mockup, no photorealistic elements"
  );
  parts.push(NEGATIVE_PROMPT);

  return parts.join(". ");
}
