"use client";

import { useState, useCallback } from "react";
import {
  LogoFormData,
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
import LogoResult from "./LogoResult";
import { ImageCostInfo, ImageUsageInfo } from "@/lib/cost";

interface GenerationResult {
  imageUrl: string;
  usage: ImageUsageInfo;
  cost: ImageCostInfo;
}

// 멀티스텝 로고 생성 위저드 메인 컴포넌트
export default function LogoWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LogoFormData>(INITIAL_FORM_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = WIZARD_STEPS.length;

  // 폼 데이터 업데이트
  const handleChange = useCallback((updates: Partial<LogoFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
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

  // 로고 생성 API 호출
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "로고 생성에 실패했습니다.");
      }

      setResult({
        imageUrl: data.imageUrl,
        usage: data.usage,
        cost: data.cost,
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
    setResult(null);
    setError(null);
  };

  // 결과 화면
  if (result) {
    return (
      <LogoResult
        imageUrl={result.imageUrl}
        brandName={formData.brandName}
        usage={result.usage}
        cost={result.cost}
        onReset={handleReset}
      />
    );
  }

  return (
    <div>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 스텝별 컨텐츠 */}
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
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      )}

      {/* 네비게이션 버튼 (6단계는 StepReview에서 생성 버튼 처리) */}
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
    </div>
  );
}
