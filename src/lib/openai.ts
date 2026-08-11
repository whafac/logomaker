import OpenAI, { toFile } from "openai";
import { ImageUsageInfo, parseImageUsage } from "./cost";
import { parseReferenceDataUrl } from "./referenceImage";
import { ReferenceImage } from "@/types/logo";

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

// gpt-image-1.5로 로고 이미지 생성 (참고 이미지가 있으면 edit 엔드포인트 사용)
export async function generateLogoImage(
  prompt: string,
  referenceImages: ReferenceImage[] = []
): Promise<LogoGenerationResult> {
  const openai = createOpenAIClient();

  const response =
    referenceImages.length > 0
      ? await openai.images.edit({
          model: "gpt-image-1.5",
          prompt,
          image: await Promise.all(
            referenceImages.map(async (image, index) => {
              const { buffer, mimeType } = parseReferenceDataUrl(image.dataUrl);
              const extension = mimeType.split("/")[1] ?? "png";
              return toFile(buffer, `reference-${index + 1}.${extension}`, {
                type: mimeType,
              });
            })
          ),
          n: 1,
          size: "1024x1024",
          quality: "medium",
          background: "transparent",
        })
      : await openai.images.generate({
          model: "gpt-image-1.5",
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
