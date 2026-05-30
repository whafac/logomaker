"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, FabricImage, IText } from "fabric";
import { toSafeFileName } from "@/lib/brandKit";
import {
  DEFAULT_EDITOR_FONT,
  EDITOR_FONTS,
  FONT_CATEGORY_LABELS,
  FontCategory,
  getEditorFontById,
  groupEditorFontsByCategory,
  loadEditorFont,
} from "@/lib/editorFonts";

interface LogoCanvasEditorProps {
  imageUrl: string;
  brandName: string;
  colors: string[];
  onClose: () => void;
}

const CANVAS_SIZE = 640;
const EXPORT_SIZE = 1024;

// Fabric.js 기반 로고 캔버스 에디터 (클라이언트 전용, API 비용 없음)
export default function LogoCanvasEditor({
  imageUrl,
  brandName,
  colors,
  onClose,
}: LogoCanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const logoRef = useRef<FabricImage | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [transparentBg, setTransparentBg] = useState(false);
  const [textColor, setTextColor] = useState(colors[0] ?? "#2563eb");
  const [selectedFontId, setSelectedFontId] = useState(DEFAULT_EDITOR_FONT.id);
  const [isFontLoading, setIsFontLoading] = useState(false);
  const [loadedPreviewFonts, setLoadedPreviewFonts] = useState<Set<string>>(
    () => new Set([DEFAULT_EDITOR_FONT.id])
  );
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fontsByCategory = useMemo(() => groupEditorFontsByCategory(), []);
  const selectedFont = getEditorFontById(selectedFontId);

  // 캔버스 배경색 적용
  const applyBackground = useCallback((canvas: Canvas, transparent: boolean, color: string) => {
    canvas.backgroundColor = transparent ? "transparent" : color;
    canvas.requestRenderAll();
  }, []);

  // 로고 이미지를 캔버스 중앙에 배치
  const centerLogo = useCallback((canvas: Canvas, logo: FabricImage) => {
    const maxWidth = CANVAS_SIZE * 0.65;
    const scale = maxWidth / (logo.width || 1);
    logo.set({
      scaleX: scale,
      scaleY: scale,
      originX: "center",
      originY: "center",
      left: CANVAS_SIZE / 2,
      top: CANVAS_SIZE / 2,
    });
    logo.setCoords();
    canvas.requestRenderAll();
  }, []);

  // 캔버스 초기화 및 로고 로드
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    let cancelled = false;

    async function loadLogo() {
      try {
        let sourceUrl = imageUrl;

        // CORS 이슈 방지: 원격 URL은 blob URL로 변환
        if (!imageUrl.startsWith("data:")) {
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error("이미지를 불러올 수 없습니다.");
          const blob = await response.blob();
          sourceUrl = URL.createObjectURL(blob);
          objectUrlRef.current = sourceUrl;
        }

        const logo = await FabricImage.fromURL(sourceUrl, {
          crossOrigin: "anonymous",
        });

        if (cancelled) return;

        logo.set({
          selectable: true,
          hasControls: true,
          lockUniScaling: true,
        });

        canvas.add(logo);
        centerLogo(canvas, logo);
        logoRef.current = logo;
        setIsReady(true);
      } catch {
        if (!cancelled) {
          setLoadError("로고 이미지를 불러오지 못했습니다.");
        }
      }
    }

    loadLogo();

    return () => {
      cancelled = true;
      canvas.dispose();
      fabricRef.current = null;
      logoRef.current = null;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [imageUrl, centerLogo]);

  // 기본 폰트(Noto Sans KR) 선로드
  useEffect(() => {
    loadEditorFont(DEFAULT_EDITOR_FONT).catch(() => {
      /* 기본 폰트 실패 시 시스템 폰트로 대체됨 */
    });
  }, []);

  // 텍스트 선택 시 폰트 드롭다운 동기화
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const syncFontFromSelection = () => {
      const active = canvas.getActiveObject();
      if (!active || active.type !== "i-text") return;

      const activeFamily = (active as IText).fontFamily ?? "";
      const matched = EDITOR_FONTS.find((font) => activeFamily.includes(font.family.split(",")[0].replace(/['"]/g, "").trim()));
      if (matched) {
        setSelectedFontId(matched.id);
      }
    };

    canvas.on("selection:created", syncFontFromSelection);
    canvas.on("selection:updated", syncFontFromSelection);

    return () => {
      canvas.off("selection:created", syncFontFromSelection);
      canvas.off("selection:updated", syncFontFromSelection);
    };
  }, [isReady]);

  // 배경색 변경 반영
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    applyBackground(canvas, transparentBg, backgroundColor);
  }, [backgroundColor, transparentBg, applyBackground]);

  // Google Font 로드 후 선택 폰트 적용
  const applyFont = useCallback(async (fontId: string, applyToActiveText = true) => {
    const font = getEditorFontById(fontId);
    setIsFontLoading(true);

    try {
      await loadEditorFont(font);
      setSelectedFontId(font.id);
      setLoadedPreviewFonts((prev) => new Set(prev).add(font.id));

      const canvas = fabricRef.current;
      if (!canvas || !applyToActiveText) return;

      const active = canvas.getActiveObject();
      if (active && active.type === "i-text") {
        (active as IText).set({ fontFamily: font.family });
        canvas.requestRenderAll();
      }
    } catch {
      alert(`"${font.label}" 폰트를 불러오지 못했습니다.`);
    } finally {
      setIsFontLoading(false);
    }
  }, []);

  // 텍스트 레이어 추가 (선택된 Google Font 적용)
  const handleAddText = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const font = getEditorFontById(selectedFontId);
    setIsFontLoading(true);

    try {
      await loadEditorFont(font);

      const text = new IText("슬로건을 입력하세요", {
        left: CANVAS_SIZE / 2,
        top: CANVAS_SIZE * 0.78,
        originX: "center",
        originY: "center",
        fontFamily: font.family,
        fontSize: 28,
        fill: textColor,
        fontWeight: "600",
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.requestRenderAll();
    } catch {
      alert(`"${font.label}" 폰트를 불러오지 못했습니다.`);
    } finally {
      setIsFontLoading(false);
    }
  };

  // 선택된 객체 삭제
  const handleDeleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    activeObjects.forEach((object) => {
      if (object === logoRef.current) return;
      canvas.remove(object);
    });

    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  // 로고 위치·크기 초기화
  const handleResetLogo = () => {
    const canvas = fabricRef.current;
    const logo = logoRef.current;
    if (!canvas || !logo) return;

    centerLogo(canvas, logo);
    canvas.setActiveObject(logo);
  };

  // 편집 결과 PNG 다운로드
  const handleExport = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const multiplier = EXPORT_SIZE / CANVAS_SIZE;
    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier,
      enableRetinaScaling: false,
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${toSafeFileName(brandName)}-edited.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">캔버스 에디터</h2>
        <p className="mt-1 text-sm text-slate-500">
          로고를 드래그·크기 조절하고 텍스트를 추가한 뒤 PNG로 저장하세요
        </p>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : (
        <div
          className="mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-lg"
          style={{
            width: CANVAS_SIZE,
            maxWidth: "100%",
            background: transparentBg
              ? "repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 50% / 20px 20px"
              : undefined,
          }}
        >
          <canvas ref={canvasRef} className="block max-w-full" />
        </div>
      )}

      {/* 편집 도구 */}
      <div className="mx-auto mt-6 max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600">
              배경색
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                  setTransparentBg(false);
                  setBackgroundColor(e.target.value);
                }}
                disabled={transparentBg}
                className="h-10 w-10 cursor-pointer rounded-lg border border-slate-200 disabled:opacity-40"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                />
                투명 배경
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600">
              텍스트 색상
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border border-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-600">
            텍스트 폰트 (Google Fonts · 20종)
          </label>
          <select
            value={selectedFontId}
            onChange={(e) => applyFont(e.target.value)}
            disabled={!isReady || isFontLoading}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-50"
            style={{ fontFamily: selectedFont.family }}
          >
            {(Object.keys(fontsByCategory) as FontCategory[]).map((category) => (
              <optgroup key={category} label={FONT_CATEGORY_LABELS[category]}>
                {fontsByCategory[category].map((font) => (
                  <option
                    key={font.id}
                    value={font.id}
                    style={{
                      fontFamily: loadedPreviewFonts.has(font.id)
                        ? font.family
                        : undefined,
                    }}
                  >
                    {font.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-400">
            {isFontLoading
              ? "폰트 로딩 중..."
              : "선택한 폰트는 새 텍스트와 선택 중인 텍스트에 적용됩니다."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary px-4 py-2 text-sm"
            onClick={handleAddText}
            disabled={!isReady || isFontLoading}
          >
            + 텍스트 추가
          </button>
          <button
            type="button"
            className="btn-secondary px-4 py-2 text-sm"
            onClick={handleResetLogo}
            disabled={!isReady}
          >
            로고 위치 초기화
          </button>
          <button
            type="button"
            className="btn-secondary px-4 py-2 text-sm"
            onClick={handleDeleteSelected}
            disabled={!isReady}
          >
            선택 삭제
          </button>
        </div>

        <p className="text-xs text-slate-400">
          로고를 드래그해 이동하고, 모서리 핸들로 크기·회전을 조절할 수 있습니다.
          텍스트는 더블클릭으로 수정하고, Google Fonts 20종 중 원하는 폰트를 선택하세요.
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          className="btn-primary"
          onClick={handleExport}
          disabled={!isReady}
        >
          편집본 PNG 저장 (1024px)
        </button>
        <button type="button" className="btn-secondary" onClick={onClose}>
          결과 화면으로
        </button>
      </div>
    </div>
  );
}
