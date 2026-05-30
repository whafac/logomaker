"use client";

import {
  LogoFormData,
  COLOR_PRESETS,
  getRecommendedPresetNames,
} from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepColorsProps {
  data: LogoFormData;
  onChange: (updates: Partial<LogoFormData>) => void;
}

// 4단계: 색상 선택
export default function StepColors({ data, onChange }: StepColorsProps) {
  const recommendedNames = data.industry
    ? getRecommendedPresetNames(data.industry)
    : [];

  const handlePresetSelect = (colors: string[]) => {
    onChange({ colors: [...colors] });
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...data.colors];
    newColors[index] = value;
    onChange({ colors: newColors });
  };

  return (
    <StepWrapper
      title="색상 선택"
      subtitle="브랜드에 어울리는 컬러 팔레트를 선택하세요"
    >
      {/* 업종 추천 안내 */}
      {data.industry && recommendedNames.length > 0 && (
        <p className="mb-4 rounded-xl bg-brand-50 px-4 py-3 text-center text-sm text-brand-700">
          <span className="font-medium">{data.industry}</span> 업종에 어울리는
          팔레트에 ✦ 표시가 있어요
        </p>
      )}

      {/* 프리셋 팔레트 */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-slate-600">
          추천 팔레트 ({COLOR_PRESETS.length}종)
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              JSON.stringify(preset.colors) === JSON.stringify(data.colors);
            const isRecommended = recommendedNames.includes(preset.name);

            return (
              <button
                key={preset.name}
                type="button"
                className={`relative rounded-xl border-2 p-3 transition-all ${
                  isSelected
                    ? "border-brand-600 ring-2 ring-brand-600/20"
                    : isRecommended
                      ? "border-brand-300 hover:border-brand-500"
                      : "border-slate-200 hover:border-brand-300"
                }`}
                onClick={() => handlePresetSelect(preset.colors)}
              >
                {isRecommended && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] text-white">
                    ✦
                  </span>
                )}
                <div className="mb-2 flex gap-1">
                  {preset.colors.map((color, i) => (
                    <div
                      key={i}
                      className="h-8 flex-1 rounded-lg border border-slate-200/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {preset.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 커스텀 색상 피커 */}
      <div>
        <p className="mb-3 text-sm font-medium text-slate-600">
          커스텀 색상 (최대 3색)
        </p>
        <div className="flex flex-wrap gap-4">
          {data.colors.map((color, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <label className="text-xs text-slate-500">
                {index === 0 ? "메인" : index === 1 ? "서브" : "포인트"}
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="h-12 w-12 cursor-pointer rounded-xl border-2 border-slate-200"
              />
              <span className="font-mono text-xs text-slate-400">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </StepWrapper>
  );
}
