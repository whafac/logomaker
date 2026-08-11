import { ReferenceImage } from "@/types/logo";

export const MAX_REFERENCE_IMAGES = 2;
export const MAX_REFERENCE_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_REFERENCE_PAYLOAD_BYTES = 2.5 * 1024 * 1024;
export const ALLOWED_REFERENCE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export type AllowedReferenceMimeType =
  (typeof ALLOWED_REFERENCE_MIME_TYPES)[number];

// 서버에서 받은 참고 이미지 data URL을 버퍼로 변환
export function parseReferenceDataUrl(dataUrl: string): {
  mimeType: AllowedReferenceMimeType;
  buffer: Buffer;
} {
  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);

  if (!match) {
    throw new Error("참고 이미지 형식이 올바르지 않습니다.");
  }

  const mimeType = match[1] as AllowedReferenceMimeType;
  const buffer = Buffer.from(match[2], "base64");

  if (buffer.length === 0) {
    throw new Error("참고 이미지가 비어 있습니다.");
  }

  if (buffer.length > MAX_REFERENCE_PAYLOAD_BYTES) {
    throw new Error("참고 이미지가 너무 큽니다. 더 작은 파일을 첨부해 주세요.");
  }

  return { mimeType, buffer };
}

// API로 전달된 참고 이미지 배열 검증
export function parseReferenceImages(value: unknown): ReferenceImage[] {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new Error("참고 이미지 형식이 올바르지 않습니다.");
  }
  if (value.length > MAX_REFERENCE_IMAGES) {
    throw new Error(`참고 이미지는 최대 ${MAX_REFERENCE_IMAGES}장까지 첨부할 수 있습니다.`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`${index + 1}번째 참고 이미지가 올바르지 않습니다.`);
    }

    const image = item as Partial<ReferenceImage>;
    if (
      typeof image.id !== "string" ||
      typeof image.name !== "string" ||
      typeof image.mimeType !== "string" ||
      typeof image.dataUrl !== "string"
    ) {
      throw new Error(`${index + 1}번째 참고 이미지가 올바르지 않습니다.`);
    }

    if (
      !ALLOWED_REFERENCE_MIME_TYPES.includes(
        image.mimeType as AllowedReferenceMimeType
      )
    ) {
      throw new Error("PNG, JPG, WEBP 이미지만 첨부할 수 있습니다.");
    }

    parseReferenceDataUrl(image.dataUrl);

    return {
      id: image.id,
      name: image.name,
      mimeType: image.mimeType,
      dataUrl: image.dataUrl,
    };
  });
}
