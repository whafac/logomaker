"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import JSZip from "jszip";
import { ImageCostInfo, ImageUsageInfo, formatKrw, formatUsd } from "@/lib/cost";
import {
  buildBrandColorsText,
  buildEditGuideText,
  toSafeFileName,
} from "@/lib/brandKit";
import EditGuideModal from "./EditGuideModal";

// Fabric.js는 SSR 불가 → 클라이언트에서만 로드
const LogoCanvasEditor = dynamic(() => import("./LogoCanvasEditor"), {
  ssr: false,
  loading: () => (
    <div className="py-16 text-center text-slate-500">캔버스 에디터 로딩 중...</div>
  ),
});

interface LogoResultProps {
  imageUrl: string;
  svg: string | null;
  brandName: string;
  colors: string[];
  usage: ImageUsageInfo;
  cost: ImageCostInfo;
  onRegenerate: () => void;
  onReset: () => void;
}

// 생성된 로고 결과 표시 컴포넌트
export default function LogoResult({
  imageUrl,
  svg,
  brandName,
  colors,
  usage,
  cost,
  onRegenerate,
  onReset,
}: LogoResultProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isDownloadingKit, setIsDownloadingKit] = useState(false);
  const safeName = toSafeFileName(brandName);

  // PNG blob 가져오기
  const fetchPngBlob = async (): Promise<Blob> => {
    if (imageUrl.startsWith("data:")) {
      const response = await fetch(imageUrl);
      return response.blob();
    }
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("PNG 다운로드 실패");
    return response.blob();
  };

  // 파일 다운로드 헬퍼
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // PNG 다운로드 (투명 배경)
  const handleDownloadPng = async () => {
    try {
      const blob = await fetchPngBlob();
      downloadBlob(blob, `${safeName}-logo.png`);
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  // SVG 다운로드
  const handleDownloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, `${safeName}-logo.svg`);
  };

  // 브랜드 키트 ZIP 다운로드
  const handleDownloadBrandKit = async () => {
    setIsDownloadingKit(true);
    try {
      const zip = new JSZip();
      const pngBlob = await fetchPngBlob();

      zip.file(`${safeName}-logo.png`, pngBlob);

      if (svg) {
        zip.file(`${safeName}-logo.svg`, svg);
      }

      zip.file("brand-colors.txt", buildBrandColorsText(brandName, colors));
      zip.file("EDIT-GUIDE.txt", buildEditGuideText(brandName));

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${safeName}-brand-kit.zip`);
    } catch {
      alert("브랜드 키트 다운로드에 실패했습니다. PNG/SVG를 개별 다운로드해 주세요.");
    } finally {
      setIsDownloadingKit(false);
    }
  };

  // 캔버스 에디터 화면
  if (showEditor) {
    return (
      <LogoCanvasEditor
        imageUrl={imageUrl}
        brandName={brandName}
        colors={colors}
        onClose={() => setShowEditor(false)}
      />
    );
  }

  return (
    <>
      <div className="animate-slide-up text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
          <span>✓</span> 로고 생성 완료!
        </div>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          {brandName} 로고
        </h2>
        <p className="mt-1 text-slate-500">
          앱 내 캔버스 편집 또는 PNG · SVG · 브랜드 키트로 내보내기
        </p>

        {/* 투명 배경 미리보기 (체커보드 패턴) */}
        <div
          className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-slate-200 p-8 shadow-lg"
          style={{
            background:
              "repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 50% / 24px 24px",
          }}
        >
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={`${brandName} logo`}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>
        </div>

        {/* 다운로드 · 편집 버튼 */}
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowEditor(true)}
          >
            캔버스에서 편집하기
          </button>

          <button type="button" className="btn-secondary" onClick={handleDownloadPng}>
            PNG 다운로드 (투명 배경)
          </button>

          {svg ? (
            <button type="button" className="btn-secondary" onClick={handleDownloadSvg}>
              SVG 다운로드 (벡터)
            </button>
          ) : (
            <p className="text-xs text-amber-600">
              SVG 변환에 실패했습니다. PNG 파일을 Canva/Photoshop에서 사용해 주세요.
            </p>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={handleDownloadBrandKit}
            disabled={isDownloadingKit}
          >
            {isDownloadingKit ? "ZIP 생성 중..." : "브랜드 키트 ZIP 다운로드"}
          </button>

          <button
            type="button"
            className="text-sm text-brand-600 underline hover:text-brand-700"
            onClick={() => setShowGuide(true)}
          >
            Canva / Photoshop 편집 가이드 보기
          </button>

          {/* 이전 입력값 유지 후 확인 단계로 돌아가 재생성 */}
          <button
            type="button"
            className="btn-secondary mt-2 border-brand-200 text-brand-700 hover:border-brand-300 hover:bg-brand-50"
            onClick={onRegenerate}
          >
            설정 수정 후 재생성
          </button>

          <button type="button" className="btn-secondary" onClick={onReset}>
            새 로고 만들기
          </button>
        </div>

        {/* ZIP 포함 내용 안내 */}
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-600">
          <p className="font-medium text-slate-800">브랜드 키트 ZIP 포함 파일</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>{safeName}-logo.png — 투명 배경 PNG (1024×1024)</li>
            <li>{safeName}-logo.svg — 벡터 SVG (편집·확대용)</li>
            <li>brand-colors.txt — HEX 컬러 코드</li>
            <li>EDIT-GUIDE.txt — Canva/Photoshop 편집 방법</li>
          </ul>
        </div>

        {/* 토큰 사용량 및 예상 비용 */}
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
          <h3 className="text-sm font-semibold text-slate-900">
            이번 생성 사용량
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            gpt-image-1.5 · medium · 1024×1024 · 투명 배경
          </p>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">입력 토큰</dt>
              <dd className="font-medium text-slate-900">
                {usage.inputTokens.toLocaleString()} tokens
              </dd>
            </div>
            <div className="flex items-center justify-between pl-3">
              <dt className="text-xs text-slate-400">↳ 텍스트</dt>
              <dd className="text-xs text-slate-600">
                {usage.textInputTokens.toLocaleString()}
              </dd>
            </div>
            <div className="flex items-center justify-between pl-3">
              <dt className="text-xs text-slate-400">↳ 이미지</dt>
              <dd className="text-xs text-slate-600">
                {usage.imageInputTokens.toLocaleString()}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">출력 토큰</dt>
              <dd className="font-medium text-slate-900">
                {usage.outputTokens.toLocaleString()} tokens
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <dt className="font-medium text-slate-700">총 토큰</dt>
              <dd className="font-semibold text-brand-700">
                {usage.totalTokens.toLocaleString()} tokens
              </dd>
            </div>
          </dl>

          <div className="mt-4 rounded-xl bg-white px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">예상 비용</span>
              <span className="font-semibold text-slate-900">
                {formatUsd(cost.usd)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                환율 {cost.exchangeRate.toLocaleString()}원/USD
              </span>
              <span className="text-base font-bold text-brand-700">
                약 {formatKrw(cost.krw)}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            OpenAI 공식 단가 기준 추정치이며, SVG 변환은 서버에서 무료 처리됩니다.
          </p>
        </div>
      </div>

      <EditGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
}
