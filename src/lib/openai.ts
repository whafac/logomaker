import OpenAI from "openai";
import { ImageUsageInfo, parseImageUsage } from "./cost";

// OpenAI 클라이언트 생성
export function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY 환경 변수가 설정되지 않았습니다."
    );
  }

  return new OpenAI({ apiKey });
}

// 로고 생성 결과 (이미지 + 토큰 사용량)
export interface LogoGenerationResult {
  buffer: Buffer;
  usage: ImageUsageInfo;
}

// gpt-image-1로 로고 이미지 생성
export async function generateLogoImage(
  prompt: string
): Promise<LogoGenerationResult> {
  const openai = createOpenAIClient();

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "medium",
    output_format: "png",
    background: "transparent",
  });

  const base64Image = response.data?.[0]?.b64_json;
  const usage = response.usage;

  if (!base64Image) {
    throw new Error("이미지 생성에 실패했습니다.");
  }

  if (!usage) {
    throw new Error("토큰 사용량 정보를 받지 못했습니다.");
  }

  return {
    buffer: Buffer.from(base64Image, "base64"),
    usage: parseImageUsage(usage),
  };
}
