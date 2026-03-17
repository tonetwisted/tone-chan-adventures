"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
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

type State = "idle" | "playing" | "error";

// Keyboard → GBC button name mapping
const KEY_TO_BUTTON: Record<string, string> = {
  ArrowUp:    "Up",
  ArrowDown:  "Down",
  ArrowLeft:  "Left",
  ArrowRight: "Right",
  z:          "A",
  Z:          "A",
  x:          "B",
  X:          "B",
  Enter:      "Start",
  Backspace:  "Select",
  a:          "L",
  A:          "L",
  s:          "S",   // R shoulder (avoid conflict with A key)
  S:          "R",
};

export default function EmulatorContainer() {
  const [state, setState] = useState<State>("playing");
  const [hasWasm] = useState(() => typeof window !== "undefined" ? supportsWasm() : true);
  const [isMobile, setIsMobile] = useState(false);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Send button event to EmulatorJS
  const fireButton = useCallback((btn: string, down: boolean) => {
    const w = window as unknown as Record<string, unknown>;
    const ejs = w.EJS_emulator as { simulateInput?: (btn: string, val: number) => void } | undefined;
    ejs?.simulateInput?.(btn, down ? 1 : 0);
  }, []);

  // On-screen button handler (touch / click)
  const handleButton = useCallback((btn: string, pressed: boolean) => {
    fireButton(btn, pressed);
    setPressed((prev) => {
      const next = new Set(prev);
      pressed ? next.add(btn) : next.delete(btn);
      return next;
    });
  }, [fireButton]);

  // Keyboard listener — only active while playing
  useEffect(() => {
    if (state !== "playing") return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Prevent arrow keys from scrolling the page
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      const btn = KEY_TO_BUTTON[e.key];
      if (!btn || e.repeat) return;
      fireButton(btn, true);
      setPressed((prev) => new Set(prev).add(btn));
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const btn = KEY_TO_BUTTON[e.key];
      if (!btn) return;
      fireButton(btn, false);
      setPressed((prev) => {
        const next = new Set(prev);
        next.delete(btn);
        return next;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [state, fireButton]);

  const handlePlay = useCallback(() => {
    if (!hasWasm) { setState("error"); return; }
    setState("playing");
  }, [hasWasm]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Shell wrapper */}
      <div
        className="w-full relative"
        style={{
          height: "clamp(480px, 85dvh, 720px)",
          maxWidth: "clamp(300px, 96vw, 440px)",
        }}
      >
        <AnimatePresence mode="wait">
          {state === "idle" ? (
            <motion.div
              key="idle"
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
            >
              <GameBoyShell onButton={handleButton} pressedButtons={pressed} isPlaying={false}>
                <button
                  onClick={handlePlay}
                  className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#0a1a0a] to-[#050508]"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <div className="text-center space-y-1">
                    <p className="font-pixel text-[6px] sm:text-[7px] text-tc-cyan/50 tracking-widest">GAME BOY COLOR</p>
                    <p className="font-pixel text-[10px] sm:text-[12px] text-tc-pink tracking-wider" style={{ textShadow: "0 0 12px #FF006E" }}>TONE CHAN</p>
                    <p className="font-pixel text-[7px] sm:text-[8px] text-tc-cream/40 tracking-widest">ADVENTURES</p>
                  </div>
                  <motion.p
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.1 }}
                    className="font-pixel text-[6px] sm:text-[7px] text-tc-cream/50 tracking-[4px] mt-2"
                  >
                    TAP TO PLAY
                  </motion.p>
                </button>
              </GameBoyShell>
            </motion.div>
          ) : state === "error" ? (
            <motion.div
              key="error"
              className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-2xl border border-tc-pink/20 bg-tc-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-pixel text-[10px] text-tc-pink">LOAD ERROR</p>
              <p className="text-tc-cream/50 text-sm text-center max-w-xs px-4">
                {!hasWasm
                  ? "WebAssembly is required. Please use a modern browser."
                  : "Failed to initialize the emulator."}
              </p>
              <button
                onClick={() => setState("idle")}
                className="font-pixel text-[9px] text-tc-cyan border border-tc-cyan/30 px-5 py-2 rounded hover:bg-tc-cyan/10 transition-colors"
              >
                GO BACK
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="playing"
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <GameBoyShell onButton={handleButton} pressedButtons={pressed} isPlaying>
                <EmulatorCanvas
                  onReady={() => {}}
                  onError={() => setState("error")}
                />
              </GameBoyShell>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient glow */}
        <div
          className="absolute -inset-4 -z-10 blur-3xl opacity-30 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #7B2FBE 0%, #FF006E 50%, transparent 80%)" }}
        />
      </div>

      {/* Desktop keyboard hints */}
      {state === "playing" && !isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {[
            { keys: "Arrows", action: "D-Pad" },
            { keys: "Z",      action: "A" },
            { keys: "X",      action: "B" },
            { keys: "Enter",  action: "Start" },
            { keys: "BkSp",   action: "Select" },
            { keys: "F",      action: "Fullscreen" },
          ].map(({ keys, action }) => (
            <div key={keys} className="flex items-center gap-1.5 text-tc-cream/30 text-xs">
              <kbd className="font-mono text-[10px] bg-white/8 border border-white/10 px-1.5 py-0.5 rounded text-tc-cyan/60">{keys}</kbd>
              <span>{action}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Play CTA */}
      {state === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <button
            onClick={handlePlay}
            className="flex items-center gap-3 px-8 py-4 rounded-xl font-pixel text-xs text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FF006E, #7B2FBE)",
              boxShadow: "0 0 24px #FF006E60, 0 0 48px #7B2FBE30",
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            PLAY DEMO
          </button>
          <p className="font-pixel text-[7px] text-tc-cream/25 tracking-widest">
            FREE · NO DOWNLOAD · BROWSER
          </p>
        </motion.div>
      )}

      {state === "playing" && (
        <button
          onClick={() => setState("idle")}
          className="mt-4 font-pixel text-[7px] text-tc-cream/25 hover:text-tc-cream/50 tracking-widest transition-colors"
        >
          ✕ EXIT
        </button>
      )}
    </div>
  );
}
