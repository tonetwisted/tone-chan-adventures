"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import GameBoyShell from "./GameBoyShell";
import { isMobileDevice, supportsWasm } from "@/lib/emulator";

const EmulatorCanvas = dynamic(() => import("./EmulatorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a140a]">
      <span className="font-pixel text-[7px] text-tc-cyan animate-pulse tracking-widest">LOADING…</span>
    </div>
  ),
});

// Libretro button indices used by EmulatorJS simulateInput(player, buttonIndex, value)
const BTN_TO_INDEX: Record<string, number> = {
  B:      0,
  Select: 2,
  Start:  3,
  Up:     4,
  Down:   5,
  Left:   6,
  Right:  7,
  A:      8,
  L:      10,
  R:      11,
};

// Button → keyboard key for event dispatch fallback
const BTN_TO_KEY: Record<string, string> = {
  Up: "ArrowUp", Down: "ArrowDown", Left: "ArrowLeft", Right: "ArrowRight",
  A: "x", B: "z", Start: "Enter", Select: "Backspace", L: "a", R: "s",
};

// Physical key → button name (for visual highlight only)
const KEY_TO_BTN: Record<string, string> = {
  ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right",
  x: "A", X: "A",
  z: "B", Z: "B",
  Enter: "Start",
  Backspace: "Select",
  a: "L", A: "L",
  s: "R", S: "R",
};

export default function EmulatorContainer() {
  const [hasWasm] = useState(() => typeof window !== "undefined" ? supportsWasm() : true);
  const [isMobile, setIsMobile] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  // Tracks whether we've already dismissed the EmulatorJS "click to resume" overlay
  const audioUnlocked = useRef(false);

  useEffect(() => { setIsMobile(isMobileDevice()); }, []);

  const fireButton = useCallback((btn: string, down: boolean) => {
    const val = down ? 1 : 0;
    const idx = BTN_TO_INDEX[btn];
    const type = down ? "keydown" : "keyup";

    // On first press: click the canvas SYNCHRONOUSLY within this trusted pointer
    // event callback — browser user-activation is still live, so AudioContext
    // unlocks and EmulatorJS dismisses its "click to resume" overlay.
    if (down && !audioUnlocked.current) {
      const canvas = document.querySelector("#ejs-player canvas") as HTMLElement | null;
      if (canvas) {
        audioUnlocked.current = true;
        canvas.click();
      }
    }

    // Method 1: simulateInput API (works once emulator core is running)
    const w = window as unknown as Record<string, unknown>;
    const gm = (w.EJS_emulator as { gameManager?: { simulateInput?: (p: number, b: number, v: number) => void } } | undefined)?.gameManager;
    if (idx !== undefined && gm?.simulateInput) {
      gm.simulateInput(0, idx, val);
    }

    // Method 2: keyboard event fallback — dispatched to document + any iframes
    const key = BTN_TO_KEY[btn];
    if (key) {
      const opts = { key, bubbles: true, cancelable: true };
      document.dispatchEvent(new KeyboardEvent(type, opts));
      document.querySelectorAll("iframe").forEach((f) => {
        try {
          const doc = (f as HTMLIFrameElement).contentDocument;
          if (doc) doc.dispatchEvent(new KeyboardEvent(type, opts));
        } catch { /* cross-origin, skip */ }
      });
    }
  }, []);

  // Touch/on-screen button press
  const handleButton = useCallback((btn: string, isDown: boolean) => {
    fireButton(btn, isDown);
    setPressed((prev) => {
      const next = new Set(prev);
      isDown ? next.add(btn) : next.delete(btn);
      return next;
    });
  }, [fireButton]);

  // Physical keyboard → fire simulateInput + visual highlight
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
      const btn = KEY_TO_BTN[e.key];
      if (!btn || e.repeat) return;
      // Keyboard press is also a trusted event — unlock on first key too
      if (!audioUnlocked.current) {
        const canvas = document.querySelector("#ejs-player canvas") as HTMLElement | null;
        if (canvas) { audioUnlocked.current = true; canvas.click(); }
      }
      fireButton(btn, true);
      setPressed((prev) => new Set(prev).add(btn));
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const btn = KEY_TO_BTN[e.key];
      if (!btn) return;
      fireButton(btn, false);
      setPressed((prev) => { const next = new Set(prev); next.delete(btn); return next; });
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [fireButton]);

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl border border-tc-pink/20 bg-tc-dark p-8">
        <p className="font-pixel text-[10px] text-tc-pink">LOAD ERROR</p>
        <p className="text-tc-cream/50 text-sm text-center max-w-xs">
          {!hasWasm ? "WebAssembly is required. Please use a modern browser." : "Failed to initialize the emulator."}
        </p>
      </div>
    );
  }

  // ── Mobile: clean screen on top, custom controls below ──────────────────────
  if (isMobile) {
    return (
      <div className="w-full flex flex-col" style={{ minHeight: "calc(100dvh - 56px)" }}>
        {/* Game screen — clean, no overlay */}
        <div
          className="w-full flex-shrink-0"
          style={{
            background: "#080810",
            boxShadow: "0 0 24px rgba(76,201,240,0.08)",
          }}
        >
          <div className="relative w-full" style={{ aspectRatio: "10/9" }}>
            <EmulatorCanvas onReady={() => {}} onError={() => setIsError(true)} />
          </div>
        </div>

        {/* Custom controls */}
        <div
          className="flex-1 flex flex-col justify-center px-4 py-4"
          style={{ background: "linear-gradient(180deg, #0d0820 0%, #050508 100%)" }}
        >
          {/* Shoulder buttons */}
          <div className="flex justify-between mb-2">
            <MobileShoulderBtn label="L" gbaKey="L" active={pressed.has("L")} onButton={handleButton} align="left" />
            <MobileShoulderBtn label="R" gbaKey="R" active={pressed.has("R")} onButton={handleButton} align="right" />
          </div>

          {/* Main row */}
          <div className="flex items-center justify-between gap-2">
            {/* D-pad */}
            <MobileDPad onButton={handleButton} pressedButtons={pressed} />

            {/* Select + Start */}
            <div className="flex flex-col items-center gap-3">
              <MobileMenuBtn label="SELECT" gbaKey="Select" active={pressed.has("Select")} onButton={handleButton} />
              <MobileMenuBtn label="START"  gbaKey="Start"  active={pressed.has("Start")}  onButton={handleButton} />
            </div>

            {/* A + B */}
            <MobileABCluster
              aActive={pressed.has("A")}
              bActive={pressed.has("B")}
              onButton={handleButton}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop: classic GameBoy shell ──────────────────────────────────────────
  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full relative"
        style={{ height: "clamp(480px, 85dvh, 720px)", maxWidth: "clamp(300px, 96vw, 440px)" }}
      >
        <GameBoyShell onButton={handleButton} pressedButtons={pressed} isPlaying>
          <EmulatorCanvas onReady={() => {}} onError={() => setIsError(true)} />
        </GameBoyShell>
        <div
          className="absolute -inset-4 -z-10 blur-3xl opacity-30 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #7B2FBE 0%, #FF006E 50%, transparent 80%)" }}
        />
      </div>

      {/* Desktop keyboard hints */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2"
      >
        {[
          { keys: "Arrows", action: "D-Pad" },
          { keys: "X",      action: "A" },
          { keys: "Z",      action: "B" },
          { keys: "Enter",  action: "Start" },
          { keys: "Shift",  action: "Select" },
        ].map(({ keys, action }) => (
          <div key={keys} className="flex items-center gap-1.5 text-tc-cream/30 text-xs">
            <kbd className="font-mono text-[10px] bg-white/8 border border-white/10 px-1.5 py-0.5 rounded text-tc-cyan/60">{keys}</kbd>
            <span>{action}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Mobile sub-components ────────────────────────────────────────────────────

function MobileDPad({
  onButton,
  pressedButtons,
}: {
  onButton: (btn: string, down: boolean) => void;
  pressedButtons: Set<string>;
}) {
  const dirs = [
    { key: "Up",    label: "▲", col: 2, row: 1 },
    { key: "Left",  label: "◄", col: 1, row: 2 },
    { key: "Right", label: "►", col: 3, row: 2 },
    { key: "Down",  label: "▼", col: 2, row: 3 },
  ];
  const sz = "clamp(88px, 26vw, 120px)";
  return (
    <div
      className="grid gap-1 flex-shrink-0"
      style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", width: sz, height: sz }}
    >
      {dirs.map(({ key, label, col, row }) => {
        const active = pressedButtons.has(key);
        return (
          <button
            key={key}
            onPointerDown={() => onButton(key, true)}
            onPointerUp={() => onButton(key, false)}
            onPointerLeave={() => onButton(key, false)}
            onPointerCancel={() => onButton(key, false)}
            className={`text-base flex items-center justify-center rounded-md transition-colors duration-75 touch-none select-none
              ${active ? "bg-tc-purple text-tc-cream" : "bg-[#2a0845] text-tc-cream/70 active:bg-tc-purple"}
            `}
            style={{ gridColumn: col, gridRow: row, WebkitTapHighlightColor: "transparent" }}
          >
            {label}
          </button>
        );
      })}
      <div style={{ gridColumn: 2, gridRow: 2 }} className="bg-[#1a0533] rounded-sm" />
    </div>
  );
}

function MobileABCluster({
  aActive, bActive, onButton,
}: {
  aActive: boolean;
  bActive: boolean;
  onButton: (btn: string, down: boolean) => void;
}) {
  const sz = "clamp(54px, 15vw, 68px)";
  return (
    <div className="relative flex-shrink-0" style={{ width: "clamp(100px, 28vw, 130px)", height: "clamp(88px, 26vw, 120px)" }}>
      {/* A button — top right */}
      <button
        onPointerDown={() => onButton("A", true)}
        onPointerUp={() => onButton("A", false)}
        onPointerLeave={() => onButton("A", false)}
        onPointerCancel={() => onButton("A", false)}
        className={`absolute right-0 top-0 rounded-full touch-none flex items-center justify-center transition-all duration-75
          ${aActive ? "bg-white scale-90" : "bg-tc-pink active:scale-90 shadow-glow-pink"}
        `}
        style={{ width: sz, height: sz, WebkitTapHighlightColor: "transparent" }}
      >
        <span className={`font-pixel text-xs ${aActive ? "text-tc-pink" : "text-white"}`}>A</span>
      </button>

      {/* B button — bottom left */}
      <button
        onPointerDown={() => onButton("B", true)}
        onPointerUp={() => onButton("B", false)}
        onPointerLeave={() => onButton("B", false)}
        onPointerCancel={() => onButton("B", false)}
        className={`absolute left-0 bottom-0 rounded-full touch-none flex items-center justify-center transition-all duration-75
          ${bActive ? "bg-white scale-90" : "bg-tc-cyan active:scale-90 shadow-glow-cyan"}
        `}
        style={{ width: sz, height: sz, WebkitTapHighlightColor: "transparent" }}
      >
        <span className={`font-pixel text-xs ${bActive ? "text-tc-cyan" : "text-[#050508]"}`}>B</span>
      </button>
    </div>
  );
}

function MobileMenuBtn({
  label, gbaKey, active, onButton,
}: {
  label: string;
  gbaKey: string;
  active: boolean;
  onButton: (btn: string, down: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onPointerDown={() => onButton(gbaKey, true)}
        onPointerUp={() => onButton(gbaKey, false)}
        onPointerLeave={() => onButton(gbaKey, false)}
        onPointerCancel={() => onButton(gbaKey, false)}
        className={`rounded-full touch-none transition-colors duration-75
          ${active ? "bg-tc-purple" : "bg-[#2a0845] active:bg-tc-purple"}
        `}
        style={{
          width: "clamp(44px, 12vw, 60px)",
          height: "clamp(13px, 3vw, 17px)",
          WebkitTapHighlightColor: "transparent",
        }}
      />
      <span className={`font-pixel text-[5px] tracking-wider ${active ? "text-tc-cream/70" : "text-tc-cream/30"}`}>
        {label}
      </span>
    </div>
  );
}

function MobileShoulderBtn({
  label, gbaKey, active, onButton, align,
}: {
  label: string;
  gbaKey: string;
  active: boolean;
  onButton: (btn: string, down: boolean) => void;
  align: "left" | "right";
}) {
  return (
    <button
      onPointerDown={() => onButton(gbaKey, true)}
      onPointerUp={() => onButton(gbaKey, false)}
      onPointerLeave={() => onButton(gbaKey, false)}
      onPointerCancel={() => onButton(gbaKey, false)}
      className={`touch-none transition-colors duration-75 rounded-lg px-5 py-1.5 border border-tc-purple/20
        ${active ? "bg-tc-purple/60" : "bg-white/5 active:bg-tc-purple/40"}
        ${align === "left" ? "rounded-tl-none" : "rounded-tr-none"}
      `}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span className={`font-pixel text-[8px] ${active ? "text-tc-cream/80" : "text-tc-cream/40"}`}>{label}</span>
    </button>
  );
}
