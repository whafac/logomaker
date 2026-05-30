// GPT Image 1.5 토큰 사용량 타입
export interface ImageUsageInfo {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  textInputTokens: number;
  imageInputTokens: number;
}

// 비용 환산 결과 타입
export interface ImageCostInfo {
  usd: number;
  krw: number;
  exchangeRate: number;
}

// OpenAI GPT Image 1.5 공식 단가 (USD / 1M tokens)
const TEXT_INPUT_PRICE_PER_TOKEN = 5 / 1_000_000;
const IMAGE_INPUT_PRICE_PER_TOKEN = 8 / 1_000_000;
const IMAGE_OUTPUT_PRICE_PER_TOKEN = 32 / 1_000_000;

// 품질·해상도별 이미지 생성 기본 요금 (USD)
const PER_IMAGE_FEES: Record<string, Record<string, number>> = {
  low: {
    "1024x1024": 0.009,
    "1024x1536": 0.013,
    "1536x1024": 0.013,
  },
  medium: {
    "1024x1024": 0.034,
    "1024x1536": 0.05,
    "1536x1024": 0.05,
  },
  high: {
    "1024x1024": 0.133,
    "1024x1536": 0.2,
    "1536x1024": 0.2,
  },
};

// USD → KRW 환율 (환경 변수로 조정 가능)
function getExchangeRate(): number {
  const rate = Number(process.env.USD_TO_KRW_RATE);
  return Number.isFinite(rate) && rate > 0 ? rate : 1400;
}

// OpenAI usage 객체를 UI용 정보로 변환
export function parseImageUsage(usage: {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_tokens_details: {
    text_tokens: number;
    image_tokens: number;
  };
}): ImageUsageInfo {
  return {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    totalTokens: usage.total_tokens,
    textInputTokens: usage.input_tokens_details.text_tokens,
    imageInputTokens: usage.input_tokens_details.image_tokens,
  };
}

// 토큰 사용량 기반 예상 비용 계산
export function calculateImageCost(
  usage: ImageUsageInfo,
  quality: "low" | "medium" | "high" = "medium",
  size: "1024x1024" | "1024x1536" | "1536x1024" = "1024x1024"
): ImageCostInfo {
  const tokenCostUsd =
    usage.textInputTokens * TEXT_INPUT_PRICE_PER_TOKEN +
    usage.imageInputTokens * IMAGE_INPUT_PRICE_PER_TOKEN +
    usage.outputTokens * IMAGE_OUTPUT_PRICE_PER_TOKEN;

  const perImageFeeUsd = PER_IMAGE_FEES[quality][size] ?? PER_IMAGE_FEES.medium["1024x1024"];
  const usd = tokenCostUsd + perImageFeeUsd;
  const exchangeRate = getExchangeRate();

  return {
    usd,
    krw: usd * exchangeRate,
    exchangeRate,
  };
}

// USD 금액 포맷
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(amount);
}

// 원화 금액 포맷
export function formatKrw(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
