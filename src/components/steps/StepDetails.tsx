"use client";

import {
  LogoFormData,
  INDUSTRY_OPTIONS,
  INDUSTRY_KEYWORD_SUGGESTIONS,
  MOOD_OPTIONS,
  AVOID_STYLE_OPTIONS,
  parseKeywords,
} from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepDetailsProps {
  data: LogoFormData;
  onChange: (updates: Partial<LogoFormData>) => void;
}

// 5단계: 브랜드 정보 입력 (업종, 키워드, 무드 등)
export default function StepDetails({ data, onChange }: StepDetailsProps) {
  const keywordCount = parseKeywords(data.keywords).length;
  const suggestions =
    INDUSTRY_KEYWORD_SUGGESTIONS[data.industry] ??
    INDUSTRY_KEYWORD_SUGGESTIONS["기타"];

  // 추천 키워드 칩 클릭 시 키워드에 추가
  const handleSuggestionClick = (keyword: string) => {
    const existing = parseKeywords(data.keywords);
    if (existing.includes(keyword)) return;

    const next = [...existing, keyword].join(", ");
    onChange({ keywords: next });
  };

  // 무드 선택 토글 (최대 3개)
  const handleMoodToggle = (mood: string) => {
    const isSelected = data.moods.includes(mood);
    if (isSelected) {
      onChange({ moods: data.moods.filter((item) => item !== mood) });
      return;
    }
    if (data.moods.length >= 3) return;
    onChange({ moods: [...data.moods, mood] });
  };

  // 피하고 싶은 스타일 토글 (최대 2개)
  const handleAvoidToggle = (style: string) => {
    const isSelected = data.avoidStyles.includes(style);
    if (isSelected) {
      onChange({
        avoidStyles: data.avoidStyles.filter((item) => item !== style),
      });
      return;
    }
    if (data.avoidStyles.length >= 2) return;
    onChange({ avoidStyles: [...data.avoidStyles, style] });
  };

  return (
    <StepWrapper
      title="브랜드 정보"
      subtitle="구체적으로 입력할수록 더 센스 있는 로고가 만들어져요"
    >
      <div className="mx-auto max-w-lg space-y-6">
        {/* 업종 선택 (필수) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            업종 <span className="text-red-500">*</span>
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
                onClick={() => onChange({ industry })}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {/* 키워드 입력 (필수, 최소 2개) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            키워드 <span className="text-red-500">*</span>
            <span className="ml-2 text-xs font-normal text-slate-400">
              최소 2개 · 쉼표로 구분
            </span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="예: 연결, 성장, 미래, 혁신"
            value={data.keywords}
            onChange={(e) => onChange({ keywords: e.target.value })}
          />
          <p
            className={`mt-1 text-xs ${
              keywordCount >= 2 ? "text-green-600" : "text-slate-400"
            }`}
          >
            {keywordCount}개 입력됨 {keywordCount < 2 && "(2개 이상 필요)"}
          </p>

          {/* 업종별 키워드 추천 */}
          {data.industry && (
            <div className="mt-3">
              <p className="mb-2 text-xs text-slate-500">추천 키워드 (클릭하여 추가)</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-all hover:border-brand-400 hover:text-brand-700"
                    onClick={() => handleSuggestionClick(keyword)}
                  >
                    + {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 브랜드 무드 (필수, 최대 3개) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            브랜드 무드 <span className="text-red-500">*</span>
            <span className="ml-2 text-xs font-normal text-slate-400">
              최대 3개
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = data.moods.includes(mood);
              const isDisabled =
                !isSelected && data.moods.length >= 3;

              return (
                <button
                  key={mood}
                  type="button"
                  disabled={isDisabled}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    isSelected
                      ? "bg-brand-600 text-white"
                      : isDisabled
                        ? "cursor-not-allowed bg-slate-50 text-slate-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  onClick={() => handleMoodToggle(mood)}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </div>

        {/* 상징/메타포 (선택) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            상징/메타포
            <span className="ml-2 text-xs font-normal text-slate-400">선택</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="예: 연결된 노드, 상승하는 곡선, 빛나는 원"
            value={data.symbolMetaphor}
            onChange={(e) => onChange({ symbolMetaphor: e.target.value })}
          />
        </div>

        {/* 피하고 싶은 스타일 (선택, 최대 2개) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            피하고 싶은 느낌
            <span className="ml-2 text-xs font-normal text-slate-400">
              선택 · 최대 2개
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {AVOID_STYLE_OPTIONS.map((style) => {
              const isSelected = data.avoidStyles.includes(style);
              const isDisabled =
                !isSelected && data.avoidStyles.length >= 2;

              return (
                <button
                  key={style}
                  type="button"
                  disabled={isDisabled}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    isSelected
                      ? "bg-red-500 text-white"
                      : isDisabled
                        ? "cursor-not-allowed bg-slate-50 text-slate-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  onClick={() => handleAvoidToggle(style)}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* 추가 설명 (선택) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            추가 요청사항
            <span className="ml-2 text-xs font-normal text-slate-400">선택</span>
          </label>
          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="원하는 디자인 요소나 레퍼런스 무드를 자유롭게 적어주세요"
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
