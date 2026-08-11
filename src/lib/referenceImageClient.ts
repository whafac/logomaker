import { ReferenceImage } from "@/types/logo";
import {
  ALLOWED_REFERENCE_MIME_TYPES,
  AllowedReferenceMimeType,
  MAX_REFERENCE_FILE_BYTES,
} from "./referenceImage";

const MAX_REFERENCE_DIMENSION = 1024;

function isAllowedMimeType(type: string): type is AllowedReferenceMimeType {
  return ALLOWED_REFERENCE_MIME_TYPES.includes(type as AllowedReferenceMimeType);
}

// 브라우저에서 이미지를 읽어 HTMLImageElement로 변환
function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("이미지를 불러오지 못했습니다."));
    };
    image.src = objectUrl;
  });
}

// 첨부 이미지를 1024px 이하로 줄여 data URL로 변환
export async function normalizeReferenceImage(file: File): Promise<ReferenceImage> {
  if (!isAllowedMimeType(file.type)) {
    throw new Error("PNG, JPG, WEBP 이미지만 첨부할 수 있습니다.");
  }

  if (file.size > MAX_REFERENCE_FILE_BYTES) {
    throw new Error("이미지는 8MB 이하만 첨부할 수 있습니다.");
  }

  const image = await loadImageElement(file);
  const scale = Math.min(
    1,
    MAX_REFERENCE_DIMENSION / Math.max(image.width, image.height)
  );
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("이미지를 처리하지 못했습니다.");
  }

  context.drawImage(image, 0, 0, width, height);

  // PNG는 투명 배경을 유지하고, 그 외는 JPEG로 용량을 줄임
  const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, 0.88);

  return {
    id: crypto.randomUUID(),
    name: file.name,
    mimeType,
    dataUrl,
  };
}
