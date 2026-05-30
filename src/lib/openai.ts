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

// DALL-E 3로 로고 이미지 생성
export async function generateLogoImage(prompt: string): Promise<string> {
  const openai = createOpenAIClient();

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    response_format: "url",
  });

  const imageUrl = response.data?.[0]?.url;

  if (!imageUrl) {
    throw new Error("이미지 생성에 실패했습니다.");
  }

  return imageUrl;
}
