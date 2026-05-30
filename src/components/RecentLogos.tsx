"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LogoRecord } from "@/types/logo";

// 최근 생성된 로고 갤러리
export default function RecentLogos() {
  const [logos, setLogos] = useState<LogoRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogos() {
      try {
        const response = await fetch("/api/logos");
        const data = await response.json();
        if (data.logos) {
          setLogos(data.logos);
        }
      } catch {
        // Supabase 미설정 시 조용히 실패
      } finally {
        setLoading(false);
      }
    }

    fetchLogos();
  }, []);

  if (loading || logos.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 border-t border-slate-200 pt-16">
      <h2 className="mb-2 text-center text-xl font-bold text-slate-900">
        최근 생성된 로고
      </h2>
      <p className="mb-8 text-center text-sm text-slate-500">
        다른 사용자들이 만든 로고를 확인해보세요
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square bg-slate-50 p-4">
              <Image
                src={logo.image_url}
                alt={`${logo.brand_name} logo`}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium text-slate-900">
                {logo.brand_name}
              </p>
              <p className="text-xs text-slate-400">{logo.style}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
