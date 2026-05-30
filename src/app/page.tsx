import LogoWizard from "@/components/LogoWizard";
import RecentLogos from "@/components/RecentLogos";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 헤더 */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              L
            </div>
            <span className="text-lg font-bold text-slate-900">LogoMaker</span>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            AI Powered
          </span>
        </div>
      </header>

      {/* 히어로 + 위저드 */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            AI로 만드는 나만의 로고
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-slate-500">
            브랜드 이름, 스타일, 색상만 선택하면 AI가 전문적인 로고를
            만들어 드립니다.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <LogoWizard />
        </div>

        <RecentLogos />
      </div>

      {/* 푸터 */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        <p>LogoMaker · Powered by OpenAI DALL-E & Supabase</p>
      </footer>
    </main>
  );
}
