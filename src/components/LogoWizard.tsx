"use client";

import { useState, useCallback } from "react";
import {
  LogoFormData,
  LogoConcept,
  INITIAL_FORM_DATA,
  WIZARD_STEPS,
  isKeywordsValid,
} from "@/types/logo";
import StepIndicator from "./StepIndicator";
import StepBrandName from "./steps/StepBrandName";
import StepLogoType from "./steps/StepLogoType";
import StepStyle from "./steps/StepStyle";
import StepColors from "./steps/StepColors";
import StepDetails from "./steps/StepDetails";
import StepReview from "./steps/StepReview";
import StepConcepts from "./steps/StepConcepts";
import LogoResult from "./LogoResult";
import { ImageCostInfo, ImageUsageInfo } from "@/lib/cost";

interface GenerationResult {
  imageUrl: string;
  svg: string | null;
  usage: ImageUsageInfo;
  cost: ImageCostInfo;
  symbolOnly: boolean;
  durationMs?: number;
}

// 멀티스텝 로고 생성 위저드 메인 컴포넌트
export default function LogoWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LogoFormData>(INITIAL_FORM_DATA);
  const [concepts, setConcepts] = useState<LogoConcept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = WIZARD_STEPS.length;

  // 폼 데이터 업데이트
  const handleChange = useCallback((updates: Partial<LogoFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      // 워드마크로 바꾸면 심볼 분리 옵션 해제
      if (next.logoType === "wordmark") {
        next.symbolTextSeparate = false;
      }
      return next;
    });
  }, []);

  // 현재 스텝 유효성 검사
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.brandName.trim().length >= 1;
      case 2:
        return !!formData.logoType;
      case 3:
        return !!formData.style;
      case 4:
        return (
          !!formData.industry &&
          isKeywordsValid(formData.keywords) &&
          formData.moods.length >= 1
        );
      case 5:
        return formData.colors.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 콘셉트 3안 요청
  const handleRequestConcepts = async () => {
    setIsLoadingConcepts(true);
    setError(null);

    try {
      const response = await fetch("/api/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "콘셉트 제안에 실패했습니다.");
      }

      setConcepts(data.concepts ?? []);
      setSelectedConceptId(data.concepts?.[0]?.id ?? null);
      setCurrentStep(7);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "콘셉트 제안 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoadingConcepts(false);
    }
  };

  // 선택한 콘셉트로 로고 시안 생성
  const handleGenerate = async () => {
    const selectedConcept = concepts.find((c) => c.id === selectedConceptId);
    if (!selectedConcept) {
      setError("디자인 콘셉트를 선택해 주세요.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          selectedConcept,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "로고 생성에 실패했습니다.");
      }

      setResult({
        imageUrl: data.imageUrl,
        svg: data.svg ?? null,
        usage: data.usage,
        cost: data.cost,
        symbolOnly: Boolean(data.symbolOnly),
        durationMs: data.durationMs,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "로고 생성 중 오류가 발생했습니다."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 처음부터 다시 시작
  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setConcepts([]);
    setSelectedConceptId(null);
    setResult(null);
    setError(null);
  };

  // 콘셉트 단계로 돌아가 다른 방향 선택 또는 재제안
  const handleRegenerate = () => {
    setResult(null);
    setError(null);
    if (concepts.length > 0) {
      setCurrentStep(7);
    } else {
      setCurrentStep(6);
    }
  };

  const displayName =
    formData.brandNameExact.trim() || formData.brandName;

  // 결과 화면
  if (result) {
    return (
      <LogoResult
        imageUrl={result.imageUrl}
        svg={result.svg}
        brandName={displayName}
        colors={formData.colors}
        usage={result.usage}
        cost={result.cost}
        symbolOnly={result.symbolOnly}
        durationMs={result.durationMs}
        onRegenerate={handleRegenerate}
        onReset={handleReset}
      />
    );
  }

  return (
    <div>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {currentStep === 1 && (
        <StepBrandName data={formData} onChange={handleChange} />
      )}
      {currentStep === 2 && (
        <StepLogoType data={formData} onChange={handleChange} />
      )}
      {currentStep === 3 && (
        <StepStyle data={formData} onChange={handleChange} />
      )}
      {currentStep === 4 && (
        <StepDetails data={formData} onChange={handleChange} />
      )}
      {currentStep === 5 && (
        <StepColors data={formData} onChange={handleChange} />
      )}
      {currentStep === 6 && (
        <StepReview
          data={formData}
          isLoadingConcepts={isLoadingConcepts}
          onRequestConcepts={handleRequestConcepts}
        />
      )}
      {currentStep === 7 && (
        <StepConcepts
          concepts={concepts}
          selectedId={selectedConceptId}
          isGenerating={isGenerating}
          onSelect={setSelectedConceptId}
          onGenerate={handleGenerate}
        />
      )}

      {currentStep < 6 && (
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            이전
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            다음
          </button>
        </div>
      )}

      {currentStep === 6 && (
        <div className="mt-6 text-center">
          <button type="button" className="btn-secondary" onClick={handlePrev}>
            ← 이전 단계로
          </button>
        </div>
      )}

      {currentStep === 7 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setCurrentStep(6)}
            disabled={isGenerating}
          >
            ← 확인 단계로
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleRequestConcepts}
            disabled={isGenerating || isLoadingConcepts}
          >
            콘셉트 다시 제안
          </button>
        </div>
      )}
    </div>
  );
}
