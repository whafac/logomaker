"use client";

import { LogoFormData, LOGO_TYPE_OPTIONS, LogoType } from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepLogoTypeProps {
  data: LogoFormData;
  onChange: (updates: Partial<LogoFormData>) => void;
}

// 2단계: 로고 유형 선택
export default function StepLogoType({ data, onChange }: StepLogoTypeProps) {
  return (
    <StepWrapper
      title="로고 유형"
      subtitle="원하는 로고 형태를 선택하세요"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {LOGO_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`card-option ${
              data.logoType === option.value ? "card-option-selected" : ""
            }`}
            onClick={() => onChange({ logoType: option.value as LogoType })}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-brand-600">
              {option.icon}
            </div>
            <h3 className="font-semibold text-slate-900">{option.label}</h3>
            <p className="mt-1 text-sm text-slate-500">{option.description}</p>
          </button>
        ))}
      </div>
    </StepWrapper>
  );
}
