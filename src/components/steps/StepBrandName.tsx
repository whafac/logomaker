"use client";

import { LogoFormData } from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepBrandNameProps {
  data: LogoFormData;
  onChange: (updates: Partial<LogoFormData>) => void;
}

// 1단계: 브랜드 이름 입력
export default function StepBrandName({ data, onChange }: StepBrandNameProps) {
  return (
    <StepWrapper
      title="브랜드 이름"
      subtitle="로고에 들어갈 상호, 브랜드, 또는 프로젝트 이름을 입력하세요"
    >
      <div className="mx-auto max-w-md">
        <input
          type="text"
          className="input-field text-center text-xl font-semibold"
          placeholder="예: BlueCoffee, 스타트업X"
          value={data.brandName}
          onChange={(e) => onChange({ brandName: e.target.value })}
          autoFocus
          maxLength={50}
        />
        <p className="mt-3 text-center text-xs text-slate-400">
          {data.brandName.length}/50자
        </p>
      </div>
    </StepWrapper>
  );
}
