"use client";

import { LogoFormData } from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepBrandNameProps {
  data: LogoFormData;
  onChange: (updates: Partial<LogoFormData>) => void;
}

// 1단계: 브랜드 이름 · 정확한 표기 입력
export default function StepBrandName({ data, onChange }: StepBrandNameProps) {
  return (
    <StepWrapper
      title="브랜드 이름"
      subtitle="로고에 들어갈 상호와 정확한 표기(띄어쓰기·대소문자)를 입력하세요"
    >
      <div className="mx-auto max-w-md space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            브랜드 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input-field text-center text-xl font-semibold"
            placeholder="예: BlueCoffee, 스타트업X"
            value={data.brandName}
            onChange={(e) => {
              const brandName = e.target.value;
              // 정확한 표기가 비어 있거나 이전 브랜드명과 같으면 동기화
              const shouldSync =
                !data.brandNameExact.trim() ||
                data.brandNameExact === data.brandName;
              onChange(
                shouldSync
                  ? { brandName, brandNameExact: brandName }
                  : { brandName }
              );
            }}
            autoFocus
            maxLength={50}
          />
          <p className="mt-2 text-center text-xs text-slate-400">
            {data.brandName.length}/50자
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            정확한 표기
            <span className="ml-2 text-xs font-normal text-slate-400">
              로고에 그대로 들어갈 철자
            </span>
          </label>
          <input
            type="text"
            className="input-field text-center"
            placeholder="예: Blue Coffee, HUB CNS"
            value={data.brandNameExact}
            onChange={(e) => onChange({ brandNameExact: e.target.value })}
            maxLength={60}
          />
        </div>
      </div>
    </StepWrapper>
  );
}
