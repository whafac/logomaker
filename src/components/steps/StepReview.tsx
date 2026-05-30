"use client";

import {
  LogoFormData,
  LOGO_TYPE_OPTIONS,
  STYLE_OPTIONS,
} from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepReviewProps {
  data: LogoFormData;
  isGenerating: boolean;
  onGenerate: () => void;
}

// 6단계: 입력 내용 확인 및 생성
export default function StepReview({
  data,
  isGenerating,
  onGenerate,
}: StepReviewProps) {
  const logoTypeLabel =
    LOGO_TYPE_OPTIONS.find((o) => o.value === data.logoType)?.label ?? "-";
  const styleLabel =
    STYLE_OPTIONS.find((o) => o.value === data.style)?.label ?? "-";

  const summaryItems = [
    { label: "브랜드 이름", value: data.brandName },
    { label: "로고 유형", value: logoTypeLabel },
    { label: "디자인 스타일", value: styleLabel },
    { label: "업종", value: data.industry || "미입력" },
    { label: "키워드", value: data.keywords || "미입력" },
  ];

  return (
    <StepWrapper
      title="확인 및 생성"
      subtitle="입력하신 내용을 확인하고 로고를 생성하세요"
    >
      <div className="mx-auto max-w-lg">
        {/* 요약 카드 */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="space-y-4">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-sm text-slate-500">{item.label}</span>
                <span className="text-sm font-medium text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}

            {/* 색상 미리보기 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">색상</span>
              <div className="flex gap-2">
                {data.colors.map((color, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-lg border border-slate-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 생성 버튼 */}
        <button
          type="button"
          className="btn-primary w-full py-4 text-base"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              AI가 로고를 만들고 있어요...
            </span>
          ) : (
            "✨ 로고 생성하기"
          )}
        </button>

        <p className="mt-3 text-center text-xs text-slate-400">
          생성에 약 15~30초가 소요됩니다
        </p>
      </div>
    </StepWrapper>
  );
}
