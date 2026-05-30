import { createServerSupabaseClient } from "./supabase";

// OpenAI에서 생성된 이미지를 Supabase Storage에 업로드
export async function uploadLogoToStorage(
  imageUrl: string,
  brandName: string
): Promise<string> {
  const supabase = createServerSupabaseClient();

  // OpenAI 임시 URL에서 이미지 다운로드
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error("생성된 이미지를 다운로드할 수 없습니다.");
  }

  const imageBuffer = await response.arrayBuffer();
  const fileName = `${Date.now()}-${brandName.replace(/[^a-zA-Z0-9가-힣]/g, "-")}.png`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(fileName, imageBuffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
  }

  // 공개 URL 반환
  const { data: publicUrlData } = supabase.storage
    .from("logos")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
