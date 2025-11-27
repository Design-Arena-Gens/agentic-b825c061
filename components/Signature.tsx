"use client";
import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";

export default function Signature({
  onChange
}: {
  onChange?: (dataUrl: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = 200 * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);
    padRef.current = new SignaturePad(canvas, {
      backgroundColor: "rgba(0,0,0,0)",
      penColor: "rgba(255,255,255,0.95)"
    });
  }, []);

  function clear() {
    padRef.current?.clear();
    onChange?.(null);
  }
  function save() {
    if (!padRef.current || padRef.current.isEmpty()) return;
    onChange?.(padRef.current.toDataURL("image/png"));
  }

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-white/20 p-2">
        <canvas ref={canvasRef} className="h-48 w-full"></canvas>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-outline" onClick={clear}>
          Effacer
        </button>
        <button className="btn btn-primary" onClick={save}>
          Enregistrer la signature
        </button>
      </div>
    </div>
  );
}

