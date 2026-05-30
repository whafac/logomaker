// 브랜드 키트 텍스트 파일 생성 유틸

const COLOR_LABELS = ["메인 (Primary)", "서브 (Secondary)", "포인트 (Accent)"];

// 브랜드 컬러 팔레트 텍스트
export function buildBrandColorsText(
  brandName: string,
  colors: string[]
): string {
  const lines = [
    `${brandName} Brand Colors`,
    "================================",
    "",
  ];

  colors.forEach((color, index) => {
    lines.push(`${COLOR_LABELS[index] ?? `Color ${index + 1}`}: ${color}`);
  });

  lines.push(
    "",
    "Canva / Photoshop / Figma에서 위 HEX 코드를",
    "색상 피커에 입력해 브랜드 컬러를 적용하세요."
  );

  return lines.join("\n");
}

// Canva·Photoshop 편집 가이드 텍스트
export function buildEditGuideText(brandName: string): string {
  return [
    `${brandName} 로고 편집 가이드`,
    "================================",
    "",
    "[ Canva에서 편집하기 ]",
    "1. canva.com 접속 → '디자인 만들기'",
    "2. '파일 업로드' → PNG 또는 SVG 로고 업로드",
    "3. 로고를 선택해 크기·위치 조정",
    "4. '텍스트 추가'로 슬로건·브랜드명 보완",
    "5. '공유' → '다운로드' → PNG/PDF 선택",
    "",
    "[ Photoshop에서 편집하기 ]",
    "1. 파일 → 열기 → PNG 로고 선택",
    "2. 배경 레이어 추가 후 원하는 색상 채우기",
    "3. 로고 레이어: 크기 조정(Ctrl+T / Cmd+T)",
    "4. SVG 사용 시: Illustrator에서 열어 경로 편집 가능",
    "5. 파일 → 내보내기 → PNG/JPG/WebP 저장",
    "",
    "[ SVG 벡터 파일 활용 ]",
    "- 무한 확대 가능 (명함, 간판, 웹 모두 OK)",
    "- Illustrator / Figma / Canva에서 SVG import",
    "- 색상 변경: 벡터 편집 프로그램에서 path 선택 후 변경",
    "",
    "[ 포함 파일 ]",
    "- {brand}-logo.png  : 투명 배경 PNG (1024×1024)",
    "- {brand}-logo.svg  : 벡터 SVG (편집·확대용)",
    "- brand-colors.txt  : 브랜드 HEX 컬러 코드",
    "",
    "※ AI 생성 로고는 시안입니다. 상업적 사용 전",
    "  상표권 중복 여부를 확인하세요.",
  ].join("\n");
}

// 파일명에 사용할 안전한 slug
export function toSafeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9가-힣-_]/g, "-").replace(/-+/g, "-");
}
