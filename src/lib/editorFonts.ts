// 캔버스 에디터용 Google Fonts 목록 (무료 · 웹 임베딩 가능)

export type FontCategory = "gothic" | "serif" | "display" | "handwriting" | "english";

export interface EditorFont {
  id: string;
  label: string;
  /** Fabric.js fontFamily 값 */
  family: string;
  /** Google Fonts CSS2 family 쿼리 */
  googleQuery: string;
  category: FontCategory;
}

export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  gothic: "고딕",
  serif: "명조·세리프",
  display: "디스플레이",
  handwriting: "손글씨",
  english: "영문 브랜드",
};

/** 인기 Google Fonts 20종 (한글 + 영문 로고용) */
export const EDITOR_FONTS: EditorFont[] = [
  {
    id: "noto-sans-kr",
    label: "Noto Sans KR",
    family: '"Noto Sans KR", sans-serif',
    googleQuery: "Noto+Sans+KR:wght@400;700",
    category: "gothic",
  },
  {
    id: "nanum-gothic",
    label: "나눔고딕",
    family: '"Nanum Gothic", sans-serif',
    googleQuery: "Nanum+Gothic:wght@400;700",
    category: "gothic",
  },
  {
    id: "gowun-dodum",
    label: "고운돋움",
    family: '"Gowun Dodum", sans-serif',
    googleQuery: "Gowun+Dodum",
    category: "gothic",
  },
  {
    id: "ibm-plex-sans-kr",
    label: "IBM Plex Sans KR",
    family: '"IBM Plex Sans KR", sans-serif',
    googleQuery: "IBM+Plex+Sans+KR:wght@400;700",
    category: "gothic",
  },
  {
    id: "noto-serif-kr",
    label: "Noto Serif KR",
    family: '"Noto Serif KR", serif',
    googleQuery: "Noto+Serif+KR:wght@400;700",
    category: "serif",
  },
  {
    id: "nanum-myeongjo",
    label: "나눔명조",
    family: '"Nanum Myeongjo", serif',
    googleQuery: "Nanum+Myeongjo:wght@400;700",
    category: "serif",
  },
  {
    id: "gowun-batang",
    label: "고운바탕",
    family: '"Gowun Batang", serif',
    googleQuery: "Gowun+Batang",
    category: "serif",
  },
  {
    id: "black-han-sans",
    label: "Black Han Sans",
    family: '"Black Han Sans", sans-serif',
    googleQuery: "Black+Han+Sans",
    category: "display",
  },
  {
    id: "do-hyeon",
    label: "Do Hyeon",
    family: '"Do Hyeon", sans-serif',
    googleQuery: "Do+Hyeon",
    category: "display",
  },
  {
    id: "jua",
    label: "Jua",
    family: '"Jua", sans-serif',
    googleQuery: "Jua",
    category: "display",
  },
  {
    id: "dongle",
    label: "Dongle",
    family: '"Dongle", sans-serif',
    googleQuery: "Dongle:wght@400;700",
    category: "display",
  },
  {
    id: "sunflower",
    label: "Sunflower",
    family: '"Sunflower", sans-serif',
    googleQuery: "Sunflower:wght@500;700",
    category: "display",
  },
  {
    id: "gaegu",
    label: "Gaegu",
    family: '"Gaegu", cursive',
    googleQuery: "Gaegu:wght@400;700",
    category: "handwriting",
  },
  {
    id: "single-day",
    label: "Single Day",
    family: '"Single Day", cursive',
    googleQuery: "Single+Day",
    category: "handwriting",
  },
  {
    id: "poor-story",
    label: "Poor Story",
    family: '"Poor Story", cursive',
    googleQuery: "Poor+Story",
    category: "handwriting",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    family: '"Montserrat", sans-serif',
    googleQuery: "Montserrat:wght@400;700",
    category: "english",
  },
  {
    id: "poppins",
    label: "Poppins",
    family: '"Poppins", sans-serif',
    googleQuery: "Poppins:wght@400;700",
    category: "english",
  },
  {
    id: "oswald",
    label: "Oswald",
    family: '"Oswald", sans-serif',
    googleQuery: "Oswald:wght@400;700",
    category: "english",
  },
  {
    id: "playfair-display",
    label: "Playfair Display",
    family: '"Playfair Display", serif',
    googleQuery: "Playfair+Display:wght@400;700",
    category: "english",
  },
  {
    id: "bebas-neue",
    label: "Bebas Neue",
    family: '"Bebas Neue", sans-serif',
    googleQuery: "Bebas+Neue",
    category: "english",
  },
];

export const DEFAULT_EDITOR_FONT = EDITOR_FONTS[0];

const loadedFontIds = new Set<string>();

/** Google Fonts CSS를 동적으로 로드 (선택 시 lazy load) */
export async function loadEditorFont(font: EditorFont): Promise<void> {
  if (loadedFontIds.has(font.id)) return;

  const linkId = `editor-font-${font.id}`;
  if (!document.getElementById(linkId)) {
    await new Promise<void>((resolve, reject) => {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.googleQuery}&display=swap`;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`폰트 로드 실패: ${font.label}`));
      document.head.appendChild(link);
    });
  }

  const primaryName = font.family.split(",")[0].replace(/['"]/g, "").trim();
  await document.fonts.load(`16px "${primaryName}"`);
  await document.fonts.load(`700 16px "${primaryName}"`);

  loadedFontIds.add(font.id);
}

/** ID로 폰트 정보 조회 */
export function getEditorFontById(id: string): EditorFont {
  return EDITOR_FONTS.find((font) => font.id === id) ?? DEFAULT_EDITOR_FONT;
}

/** 카테고리별로 그룹화 */
export function groupEditorFontsByCategory(): Record<FontCategory, EditorFont[]> {
  const groups: Record<FontCategory, EditorFont[]> = {
    gothic: [],
    serif: [],
    display: [],
    handwriting: [],
    english: [],
  };

  for (const font of EDITOR_FONTS) {
    groups[font.category].push(font);
  }

  return groups;
}
