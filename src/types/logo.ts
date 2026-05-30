// 로고 생성 위저드에서 수집하는 사용자 입력 타입
export interface LogoFormData {
  brandName: string;
  logoType: LogoType | "";
  style: DesignStyle | "";
  colors: string[];
  industry: string;
  keywords: string;
  moods: string[];
  avoidStyles: string[];
  symbolMetaphor: string;
  description: string;
}

export type LogoType =
  | "wordmark"
  | "icon"
  | "combination"
  | "emblem";

export type DesignStyle =
  | "minimal"
  | "modern"
  | "vintage"
  | "playful"
  | "corporate"
  | "luxury"
  | "tech"
  | "organic";

export interface LogoRecord {
  id: string;
  brand_name: string;
  logo_type: string;
  style: string;
  colors: string[];
  industry: string | null;
  keywords: string | null;
  description: string | null;
  image_url: string;
  prompt: string;
  created_at: string;
}

export const LOGO_TYPE_OPTIONS: {
  value: LogoType;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "wordmark",
    label: "워드마크",
    description: "브랜드 이름만으로 구성된 텍스트 로고",
    icon: "Aa",
  },
  {
    value: "icon",
    label: "심볼/아이콘",
    description: "그래픽 심볼만 있는 로고",
    icon: "◆",
  },
  {
    value: "combination",
    label: "조합형",
    description: "심볼과 텍스트가 함께 있는 로고",
    icon: "◆Aa",
  },
  {
    value: "emblem",
    label: "엠블럼",
    description: "배지나 문장 형태의 로고",
    icon: "⬡",
  },
];

export const STYLE_OPTIONS: {
  value: DesignStyle;
  label: string;
  description: string;
}[] = [
  { value: "minimal", label: "미니멀", description: "깔끔하고 단순한 디자인" },
  { value: "modern", label: "모던", description: "세련되고 현대적인 느낌" },
  { value: "vintage", label: "빈티지", description: "클래식하고 레트로한 감성" },
  { value: "playful", label: "플레이풀", description: "친근하고 재미있는 분위기" },
  { value: "corporate", label: "코퍼레이트", description: "신뢰감 있는 비즈니스 스타일" },
  { value: "luxury", label: "럭셔리", description: "고급스럽고 우아한 느낌" },
  { value: "tech", label: "테크", description: "혁신적이고 디지털한 스타일" },
  { value: "organic", label: "오가닉", description: "자연스럽고 부드러운 형태" },
];

export const COLOR_PRESETS: {
  name: string;
  colors: string[];
  tags?: string[];
}[] = [
  { name: "블루", colors: ["#2563eb", "#1e40af", "#ffffff"], tags: ["IT/테크", "금융"] },
  { name: "그린", colors: ["#16a34a", "#15803d", "#f0fdf4"], tags: ["건강/피트니스", "교육"] },
  { name: "퍼플", colors: ["#7c3aed", "#5b21b6", "#faf5ff"], tags: ["패션/뷰티", "엔터테인먼트"] },
  { name: "오렌지", colors: ["#ea580c", "#c2410c", "#fff7ed"], tags: ["음식/카페", "엔터테인먼트"] },
  { name: "핑크", colors: ["#db2777", "#9d174d", "#fdf2f8"], tags: ["패션/뷰티"] },
  { name: "모노", colors: ["#18181b", "#71717a", "#ffffff"], tags: ["IT/테크", "부동산"] },
  { name: "골드", colors: ["#ca8a04", "#854d0e", "#fefce8"], tags: ["금융", "부동산"] },
  { name: "틸", colors: ["#0d9488", "#115e59", "#f0fdfa"], tags: ["건강/피트니스"] },
  { name: "코랄+네이비", colors: ["#ff6b6b", "#1e3a5f", "#ffffff"], tags: ["IT/테크", "교육"] },
  { name: "세이지+크림", colors: ["#87a878", "#f5f0e8", "#3d5a3d"], tags: ["건강/피트니스", "음식/카페"] },
  { name: "버건디+골드", colors: ["#722f37", "#c5a028", "#faf8f5"], tags: ["음식/카페", "패션/뷰티"] },
  { name: "일렉트릭+라임", colors: ["#0066ff", "#bfff00", "#0a0a0a"], tags: ["IT/테크", "엔터테인먼트"] },
  { name: "차콜+민트", colors: ["#2d3436", "#00cec9", "#ffffff"], tags: ["IT/테크"] },
  { name: "로즈+그레이", colors: ["#e84393", "#636e72", "#ffffff"], tags: ["패션/뷰티"] },
  { name: "딥퍼플+실버", colors: ["#4a0e8f", "#a29bfe", "#f8f9fa"], tags: ["IT/테크", "금융"] },
  { name: "선셋", colors: ["#ff7675", "#fdcb6e", "#2d3436"], tags: ["엔터테인먼트", "음식/카페"] },
  { name: "포레스트", colors: ["#1b4332", "#52b788", "#d8f3dc"], tags: ["건강/피트니스"] },
  { name: "스카이", colors: ["#48cae4", "#0077b6", "#ffffff"], tags: ["교육", "IT/테크"] },
  { name: "와인", colors: ["#6d071a", "#c9184a", "#fff0f3"], tags: ["패션/뷰티", "음식/카페"] },
  { name: "샌드", colors: ["#d4a574", "#8b6914", "#fefae0"], tags: ["부동산", "음식/카페"] },
  { name: "미드나잇", colors: ["#0f0c29", "#302b63", "#24243e"], tags: ["IT/테크", "엔터테인먼트"] },
  { name: "라벤더", colors: ["#b8b5ff", "#7868e6", "#ffffff"], tags: ["패션/뷰티", "교육"] },
  { name: "어스", colors: ["#bc6c25", "#606c38", "#fefae0"], tags: ["음식/카페", "건강/피트니스"] },
  { name: "오션", colors: ["#0077b6", "#00b4d8", "#caf0f8"], tags: ["건강/피트니스", "교육"] },
];

// 브랜드 무드 선택 옵션 (최대 3개)
export const MOOD_OPTIONS = [
  "신뢰",
  "혁신",
  "따뜻함",
  "프리미엄",
  "친근함",
  "대담함",
  "세련됨",
  "자연스러움",
  "전문성",
  "창의성",
];

// 피하고 싶은 스타일 (최대 2개)
export const AVOID_STYLE_OPTIONS = [
  "유치함",
  "복잡함",
  "옛날 느낌",
  "평범함",
  "어두움",
  "날카로움",
];

export const INDUSTRY_OPTIONS = [
  "IT/테크",
  "음식/카페",
  "패션/뷰티",
  "교육",
  "건강/피트니스",
  "금융",
  "부동산",
  "엔터테인먼트",
  "기타",
];

// 업종별 키워드 추천
export const INDUSTRY_KEYWORD_SUGGESTIONS: Record<string, string[]> = {
  "IT/테크": ["혁신", "연결", "속도", "미래", "데이터"],
  "음식/카페": ["따뜻함", "향기", "수제", "커뮤니티", "편안함"],
  "패션/뷰티": ["세련됨", "우아함", "개성", "트렌드", "감각"],
  "교육": ["성장", "지식", "영감", "신뢰", "발전"],
  "건강/피트니스": ["활력", "균형", "자연", "웰빙", "에너지"],
  "금융": ["신뢰", "안정", "성장", "전문성", "보호"],
  "부동산": ["신뢰", "공간", "가치", "프리미엄", "안정"],
  "엔터테인먼트": ["창의성", "즐거움", "에너지", "개성", "스토리"],
  "기타": ["신뢰", "성장", "혁신", "친근함", "전문성"],
};

export const INITIAL_FORM_DATA: LogoFormData = {
  brandName: "",
  logoType: "",
  style: "",
  colors: ["#2563eb", "#1e40af", "#ffffff"],
  industry: "",
  keywords: "",
  moods: [],
  avoidStyles: [],
  symbolMetaphor: "",
  description: "",
};

export const WIZARD_STEPS = [
  { id: 1, title: "브랜드 이름", subtitle: "로고에 들어갈 이름을 입력하세요" },
  { id: 2, title: "로고 유형", subtitle: "원하는 로고 형태를 선택하세요" },
  { id: 3, title: "디자인 스타일", subtitle: "원하는 분위기를 선택하세요" },
  { id: 4, title: "브랜드 정보", subtitle: "업종과 키워드를 입력하면 더 센스 있는 로고가 만들어져요" },
  { id: 5, title: "색상", subtitle: "업종에 어울리는 컬러 팔레트를 선택하세요" },
  { id: 6, title: "확인 및 생성", subtitle: "입력 내용을 확인하고 로고를 만드세요" },
];

// 키워드 문자열을 배열로 파싱
export function parseKeywords(keywords: string): string[] {
  return keywords
    .split(/[,，、·\s]+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

// 키워드 최소 2개 이상인지 검증
export function isKeywordsValid(keywords: string): boolean {
  return parseKeywords(keywords).length >= 2;
}

// 업종에 추천되는 색상 프리셋 이름 목록
export function getRecommendedPresetNames(industry: string): string[] {
  return COLOR_PRESETS.filter((preset) => preset.tags?.includes(industry)).map(
    (preset) => preset.name
  );
}
