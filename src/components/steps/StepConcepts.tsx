"use client";

import { LogoConcept } from "@/types/logo";
import { StepWrapper } from "../StepIndicator";

interface StepConceptsProps {
  concepts: LogoConcept[];
  selectedId: string | null;
  isGenerating: boolean;
  onSelect: (id: string) => void;
  onGenerate: () => void;
}

// 7단계: 서로 다른 디자인 콘셉트 3안 중 선택
export default function StepConcepts({
  concepts,
  selectedId,
  isGenerating,
  onSelect,
  onGenerate,
}: StepConceptsProps) {
  return (
    <StepWrapper
      title="콘셉트 선택"
      subtitle="색상만 다른 변형이 아니라, 아이디어·심볼·서체 방향이 다른 3안입니다"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {concepts.map((concept, index) => {
          const selected = selectedId === concept.id;
          return (
            <button
              key={concept.id}
              type="button"
              onClick={() => onSelect(concept.id)}
              className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                selected
                  ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600/20"
                  : "border-slate-200 bg-white hover:border-brand-300"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {concept.title}
                </h3>
              </div>
              <dl className="space-y-2 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-800">핵심 아이디어</dt>
                  <dd>{concept.coreIdea}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-800">심볼 구성</dt>
                  <dd>{concept.symbolStructure}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-800">서체 방향</dt>
                  <dd>{concept.typographyDirection}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-800">색상과 선택 이유</dt>
                  <dd>{concept.colorRationale}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-800">다른 점</dt>
                  <dd>{concept.differentiation}</dd>
                </div>
              </dl>
            </button>
          );
        })}

        <button
          type="button"
          className="btn-primary w-full py-4 text-base"
          onClick={onGenerate}
          disabled={!selectedId || isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
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
              선택한 콘셉트로 시안 생성 중...
            </span>
          ) : (
            "선택한 콘셉트로 로고 시안 생성"
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          생성에는 약 15~30초가 소요됩니다. 결과는 로고 원본 시안이며 적용
          목업과는 구분됩니다.
        </p>
      </div>
    </StepWrapper>
  );
}
