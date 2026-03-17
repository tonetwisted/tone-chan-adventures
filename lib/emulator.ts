/**
 * Emulator integration helpers.
 *
 * Strategy: Use EmulatorJS (https://emulatorjs.org) which wraps mgba for GBA.
 * EmulatorJS is loaded dynamically from /public/emulatorjs/ (self-hosted) or
 * from the CDN. We self-host for performance and reliability.
 *
 * Self-hosting: download the latest release from
 *   https://github.com/EmulatorJS/EmulatorJS/releases
 * and extract it into /public/emulatorjs/
 *
 * Then the only thing you need to do is set window.EJS_* globals and inject
 * the loader script — this module handles that entirely.
 */

import type { EmulatorConfig, RomConfig, SkinConfig } from "@/types";

export const DEFAULT_EMULATOR_CONFIG: EmulatorConfig = {
  system: "gbc",       // Game Boy Color (.gbc / .gb files)
  core: "gambatte",    // gambatte is the GBC core in EmulatorJS
  width: 160,
  height: 144,
  volume: 0.7,
  fps: 60,
  saveStateEnabled: true,
  cheatsEnabled: false,
  skipBios: true,
};

// 🔧 Rename your .gbc file to match this, or change this path to match your filename
export const DEMO_ROM: RomConfig = {
  id: "tone-chan-demo",
  filename: "tone-chan-demo.gbc",
  path: "/roms/tone-chan-demo.gbc",
  isDemo: true,
};

// ─── EmulatorJS Loader ────────────────────────────────────────────────────────

export interface EmulatorJSOptions {
  containerId: string;
  romPath: string;
  config?: Partial<EmulatorConfig>;
  skin?: SkinConfig;
  onReady?: () => void;
  onError?: (err: string) => void;
}

/**
 * Initialize the EmulatorJS runtime inside `containerId`.
 * Returns a cleanup function that removes the injected script.
 */
export function initEmulatorJS(opts: EmulatorJSOptions): () => void {
  const cfg = { ...DEFAULT_EMULATOR_CONFIG, ...opts.config };

  // Set EmulatorJS global config vars
  const w = window as unknown as Record<string, unknown>;
  w.EJS_player          = `#${opts.containerId}`;
  w.EJS_gameName        = "Tone Chan Adventures";
  w.EJS_gameUrl         = opts.romPath;
  w.EJS_core            = cfg.core;
  // Use CDN — no local install required.
  // Swap to "/emulatorjs/data/" if you self-host later.
  w.EJS_pathtodata      = "https://cdn.emulatorjs.org/stable/data/";
  w.EJS_startOnLoaded   = true;
  w.EJS_volume          = cfg.volume;
  w.EJS_mobileControls  = false;   // disable built-in touch overlay; we use our own shell
  w.EJS_defaultOptions  = {
    "save-state-location": "keep in browser",
  };
  w.EJS_Buttons         = {
    playPause: true,
    restart: true,
    mute: true,
    settings: true,
    fullscreen: true,
    saveState: cfg.saveStateEnabled,
    loadState: cfg.saveStateEnabled,
    screenRecord: false,
    gamepad: true,
    cheat: cfg.cheatsEnabled,
    volume: true,
    saveSavFiles: true,
    loadSavFiles: true,
    quickSave: cfg.saveStateEnabled,
    quickLoad: cfg.saveStateEnabled,
    screenshot: false,
    cacheManager: false,
  };

  if (opts.onReady)  w.EJS_onGameStart = opts.onReady;
  if (opts.onError)  w.EJS_onLoadError = opts.onError;

  // Inject the loader script from CDN
  const script = document.createElement("script");
  script.src   = "https://cdn.emulatorjs.org/stable/data/loader.js";
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
    // Clean EJS globals
    const keys = Object.keys(w).filter((k) => k.startsWith("EJS_"));
    keys.forEach((k) => delete w[k]);
  };
}

// ─── Keyboard → GBA Button Mapping ───────────────────────────────────────────

export const KEY_MAP: Record<string, number> = {
  ArrowUp:    0,
  ArrowDown:  1,
  ArrowLeft:  2,
  ArrowRight: 3,
  z:          4,   // A
  x:          5,   // B
  a:          8,   // L
  s:          9,   // R
  Enter:      7,   // Start
  Backspace:  6,   // Select
};

// ─── Mobile Detection ─────────────────────────────────────────────────────────

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function supportsWasm(): boolean {
  try {
    if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
      const module = new WebAssembly.Module(
        Uint8Array.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00])
      );
      return module instanceof WebAssembly.Module;
    }
  } catch {
    // ignore
  }
  return false;
}
