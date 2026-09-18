"use client";

interface EditGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Canva·Photoshop 편집 가이드 모달
export default function EditGuideModal({ isOpen, onClose }: EditGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Canva / Photoshop 편집 가이드
          </h3>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-left text-sm text-slate-700">
          <section>
            <h4 className="mb-2 font-semibold text-brand-700">Canva에서 편집</h4>
            <ol className="list-decimal space-y-1 pl-5 text-slate-600">
              <li>
                <a
                  href="https://www.canva.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  canva.com
                </a>
                {" "}접속 → &apos;디자인 만들기&apos;
              </li>
              <li>&apos;업로드&apos; → PNG 또는 SVG 로고 파일 선택</li>
              <li>로고 크기·위치 조정, 배경색 변경</li>
              <li>&apos;텍스트&apos; 추가로 슬로건·브랜드명 보완</li>
              <li>&apos;공유&apos; → &apos;다운로드&apos; → PNG/PDF 저장</li>
            </ol>
          </section>

          <section>
            <h4 className="mb-2 font-semibold text-brand-700">
              Photoshop에서 편집
            </h4>
            <ol className="list-decimal space-y-1 pl-5 text-slate-600">
              <li>파일 → 열기 → PNG 로고 선택</li>
              <li>새 레이어로 배경색 추가</li>
              <li>로고 레이어 크기 조정 (Ctrl+T / Cmd+T)</li>
              <li>필요 시 밝기·채도 조정 (이미지 → 조정)</li>
              <li>파일 → 내보내기 → PNG/JPG/WebP 저장</li>
            </ol>
          </section>

          <section>
            <h4 className="mb-2 font-semibold text-brand-700">
              트레이싱 SVG 안내
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-slate-600">
              <li>PNG를 자동 트레이싱한 근사 SVG입니다</li>
              <li>실제 벡터 경로가 있는 원본 로고가 아닙니다</li>
              <li>단순 확대·색 변경용으로만 참고하세요</li>
              <li>정밀 편집은 PNG + 캔버스/Illustrator를 권장합니다</li>
            </ul>
          </section>

          <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
            AI 결과는 로고 원본 시안입니다. 명함·간판 등 적용 목업과 구분되며,
            상업 사용 전 상표·유사 디자인 점검은 별도로 하세요.
          </p>
        </div>

        <button type="button" className="btn-primary mt-6 w-full" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
