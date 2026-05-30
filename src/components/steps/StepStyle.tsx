"use client";

import { LogoFormData, STYLE_OPTIONS, DesignStyle } from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepStyleProps {
  data: LogoFormData;
  onChange: (updates: Partial<LogoFormData>) => void;
}

// 3단계: 디자인 스타일 선택
export default function StepStyle({ data, onChange }: StepStyleProps) {
  return (
    <StepWrapper
      title="디자인 스타일"
      subtitle="원하는 분위기와 느낌을 선택하세요"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STYLE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`card-option ${
              data.style === option.value ? "card-option-selected" : ""
            }`}
            onClick={() => onChange({ style: option.value as DesignStyle })}
          >
            <h3 className="font-semibold text-slate-900">{option.label}</h3>
            <p className="mt-1 text-xs text-slate-500">{option.description}</p>
          </button>
        ))}
      </div>
    </StepWrapper>
  );
}
