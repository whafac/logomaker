"use client";

import { LogoFormData, INDUSTRY_OPTIONS } from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepDetailsProps {
  data: LogoFormData;
  onChange: (updates: Partial<LogoFormData>) => void;
}

// 5단계: 업종 및 추가 정보 입력
export default function StepDetails({ data, onChange }: StepDetailsProps) {
  return (
    <StepWrapper
      title="추가 정보"
      subtitle="더 정확한 로고를 위해 추가 정보를 입력해주세요 (선택)"
    >
      <div className="mx-auto max-w-lg space-y-6">
        {/* 업종 선택 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            업종
          </label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_OPTIONS.map((industry) => (
              <button
                key={industry}
                type="button"
                className={`rounded-full px-4 py-2 text-sm transition-all ${
                  data.industry === industry
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                onClick={() =>
                  onChange({
                    industry: data.industry === industry ? "" : industry,
                  })
                }
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {/* 키워드 입력 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            키워드
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="예: 커피, 따뜻함, 친근함"
            value={data.keywords}
            onChange={(e) => onChange({ keywords: e.target.value })}
          />
        </div>

        {/* 추가 설명 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            추가 요청사항
          </label>
          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="원하는 디자인 요소나 느낌을 자유롭게 적어주세요"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            maxLength={300}
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {data.description.length}/300
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}
