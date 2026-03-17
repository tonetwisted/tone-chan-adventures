"use client";

import { useEffect, useRef, useState } from "react";
import { initEmulatorJS, DEMO_ROM, isMobileDevice } from "@/lib/emulator";
import type { EmulatorConfig, SkinConfig } from "@/types";

interface Props {
  romPath?: string;
  config?: Partial<EmulatorConfig>;
  skin?: SkinConfig;
  onReady?: () => void;
  onError?: (err: string) => void;
  className?: string;
}

type State = "idle" | "loading" | "ready" | "error";

export default function EmulatorCanvas({
  romPath = DEMO_ROM.path,
  config,
  onReady,
  onError,
  className = "",
}: Props) {
  const containerId = "ejs-player";
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // EmulatorJS requires window, so guard SSR
    if (typeof window === "undefined") return;

    // Watch for EmulatorJS touch/gamepad overlay elements and hide them
    // so only our custom GameBoyShell controls are visible
    const container = document.getElementById(containerId);
    const observer = new MutationObserver(() => {
      if (!container) return;
      container.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const cls = (el.className || "").toString().toLowerCase();
        const id  = (el.id || "").toLowerCase();
        if (
          cls.includes("gamepad") ||
          cls.includes("mobile") ||
          cls.includes("control") ||
          cls.includes("button") ||
          cls.includes("joystick") ||
          cls.includes("dpad") ||
          id.includes("gamepad") ||
          id.includes("mobile") ||
          id.includes("control")
        ) {
          el.style.setProperty("display", "none", "important");
        }
      });
    });

    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    const cleanup = initEmulatorJS({
      containerId,
      romPath,
      config,
      onReady: () => {
        setState("ready");
        onReady?.();
      },
      onError: (err) => {
        setState("error");
        setError(err ?? "Failed to load emulator");
        onError?.(err);
      },
    });

    cleanupRef.current = cleanup;

    return () => {
      observer.disconnect();
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [romPath]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading state */}
      {state === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1a0a] z-20">
          <div className="font-pixel text-[8px] text-tc-cyan animate-pulse tracking-widest mb-3">
            LOADING ROM...
          </div>
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-tc-pink animate-pulse rounded-full" style={{ width: "60%" }} />
          </div>
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1a0a] z-20 p-4">
          <span className="font-pixel text-[7px] text-tc-pink mb-2 tracking-widest">ERROR</span>
          <p className="text-tc-cream/50 text-xs text-center">
            {error ?? "Emulator failed to load."}
          </p>
          {isMobileDevice() && (
            <p className="text-tc-cream/30 text-[10px] text-center mt-2">
              Mobile performance may be limited. Try on desktop for best experience.
            </p>
          )}
        </div>
      )}

      {/* EmulatorJS target div */}
      <div
        id={containerId}
        className="w-full h-full"
        style={{ aspectRatio: "10/9" }}
      />
    </div>
  );
}
