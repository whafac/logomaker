import OpenAI from "openai";

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

// gpt-image-1로 로고 이미지 생성 (base64 PNG 반환)
export async function generateLogoImage(prompt: string): Promise<Buffer> {
  const openai = createOpenAIClient();

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "medium",
    output_format: "png",
  });

  const base64Image = response.data?.[0]?.b64_json;

  if (!base64Image) {
    throw new Error("이미지 생성에 실패했습니다.");
  }

  return Buffer.from(base64Image, "base64");
}
