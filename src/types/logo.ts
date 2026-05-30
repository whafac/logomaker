// 로고 생성 위저드에서 수집하는 사용자 입력 타입
export interface LogoFormData {
  brandName: string;
  logoType: LogoType | "";
  style: DesignStyle | "";
  colors: string[];
  industry: string;
  keywords: string;
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
}[] = [
  { name: "블루", colors: ["#2563eb", "#1e40af", "#ffffff"] },
  { name: "그린", colors: ["#16a34a", "#15803d", "#f0fdf4"] },
  { name: "퍼플", colors: ["#7c3aed", "#5b21b6", "#faf5ff"] },
  { name: "오렌지", colors: ["#ea580c", "#c2410c", "#fff7ed"] },
  { name: "핑크", colors: ["#db2777", "#9d174d", "#fdf2f8"] },
  { name: "모노", colors: ["#18181b", "#71717a", "#ffffff"] },
  { name: "골드", colors: ["#ca8a04", "#854d0e", "#fefce8"] },
  { name: "틸", colors: ["#0d9488", "#115e59", "#f0fdfa"] },
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

export const INITIAL_FORM_DATA: LogoFormData = {
  brandName: "",
  logoType: "",
  style: "",
  colors: ["#2563eb", "#1e40af", "#ffffff"],
  industry: "",
  keywords: "",
  description: "",
};

export const WIZARD_STEPS = [
  { id: 1, title: "브랜드 이름", subtitle: "로고에 들어갈 이름을 입력하세요" },
  { id: 2, title: "로고 유형", subtitle: "원하는 로고 형태를 선택하세요" },
  { id: 3, title: "디자인 스타일", subtitle: "원하는 분위기를 선택하세요" },
  { id: 4, title: "색상", subtitle: "브랜드 컬러를 선택하세요" },
  { id: 5, title: "추가 정보", subtitle: "업종과 키워드를 알려주세요" },
  { id: 6, title: "확인 및 생성", subtitle: "입력 내용을 확인하고 로고를 만드세요" },
];
