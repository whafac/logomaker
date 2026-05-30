"use client";

import { ReactNode } from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

// 위저드 진행 단계 표시 컴포넌트
export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">
          {currentStep} / {totalSteps}
        </span>
        <span className="text-slate-400">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}

interface StepWrapperProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

// 각 스텝 공통 레이아웃
export function StepWrapper({ title, subtitle, children }: StepWrapperProps) {
  return (
    <div className="animate-slide-up">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
