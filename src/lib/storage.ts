import { createServerSupabaseClient } from "./supabase";

// 생성된 이미지 버퍼를 Supabase Storage에 업로드
export async function uploadLogoToStorage(
  imageBuffer: Buffer,
  brandName: string
): Promise<string> {
  const supabase = createServerSupabaseClient();

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
