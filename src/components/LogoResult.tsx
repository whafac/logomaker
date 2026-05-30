"use client";

import Image from "next/image";
import { ImageCostInfo, ImageUsageInfo, formatKrw, formatUsd } from "@/lib/cost";

interface LogoResultProps {
  imageUrl: string;
  brandName: string;
  usage: ImageUsageInfo;
  cost: ImageCostInfo;
  onReset: () => void;
}

// 생성된 로고 결과 표시 컴포넌트
export default function LogoResult({
  imageUrl,
  brandName,
  usage,
  cost,
  onReset,
}: LogoResultProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${brandName}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // CORS 등으로 다운로드 실패 시 새 탭에서 열기
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="animate-slide-up text-center">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
        <span>✓</span> 로고 생성 완료!
      </div>

      <h2 className="mt-4 text-2xl font-bold text-slate-900">
        {brandName} 로고
      </h2>
      <p className="mt-1 text-slate-500">AI가 만든 당신만의 로고입니다</p>

      {/* 로고 이미지 */}
      <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
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

      {/* 액션 버튼 */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" className="btn-primary" onClick={handleDownload}>
          PNG 다운로드
        </button>
        <button type="button" className="btn-secondary" onClick={onReset}>
          새 로고 만들기
        </button>
      </div>

      {/* 토큰 사용량 및 예상 비용 */}
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
        <h3 className="text-sm font-semibold text-slate-900">
          이번 생성 사용량
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          gpt-image-1 · medium · 1024×1024 기준
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
          OpenAI 공식 단가 기준 추정치이며, 실제 청구 금액과 소수점 단위로
          차이가 날 수 있습니다.
        </p>
      </div>
    </div>
  );
}
