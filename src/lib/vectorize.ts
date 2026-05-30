import sharp from "sharp";
import ImageTracer from "imagetracerjs";

// PNG 버퍼를 SVG 벡터로 변환 (서버 CPU만 사용, 추가 API 비용 없음)
export async function convertPngToSvg(pngBuffer: Buffer): Promise<string> {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const imageData = {
    width: info.width,
    height: info.height,
    data: new Uint8ClampedArray(data),
  };

  // 로고에 적합한 트레이싱 옵션
  const svg = ImageTracer.imagedataToSVG(imageData, {
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    colorsampling: 1,
    numberofcolors: 16,
    mincolorratio: 0.02,
    colorquantcycles: 3,
    scale: 1,
    linefilter: true,
    strokewidth: 1,
    viewbox: true,
  });

  if (!svg || !svg.includes("<svg")) {
    throw new Error("SVG 변환 결과가 유효하지 않습니다.");
  }

  return svg;
}
