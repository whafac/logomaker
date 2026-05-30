"use client";

import Image from "next/image";

interface LogoResultProps {
  imageUrl: string;
  brandName: string;
  onReset: () => void;
}

// 생성된 로고 결과 표시 컴포넌트
export default function LogoResult({
  imageUrl,
  brandName,
  onReset,
}: LogoResultProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${brandName}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // CORS 등으로 다운로드 실패 시 새 탭에서 열기
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="animate-slide-up text-center">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
        <span>✓</span> 로고 생성 완료!
      </div>

      <h2 className="mt-4 text-2xl font-bold text-slate-900">
        {brandName} 로고
      </h2>
      <p className="mt-1 text-slate-500">AI가 만든 당신만의 로고입니다</p>

      {/* 로고 이미지 */}
      <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt={`${brandName} logo`}
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" className="btn-primary" onClick={handleDownload}>
          PNG 다운로드
        </button>
        <button type="button" className="btn-secondary" onClick={onReset}>
          새 로고 만들기
        </button>
      </div>
    </div>
  );
}
