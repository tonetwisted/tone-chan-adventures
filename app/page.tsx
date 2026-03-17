import type { Metadata } from "next";
import EmulatorClientWrapper from "@/components/emulator/EmulatorClientWrapper";
import { GAME_META, SOCIAL_LINKS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tone Chan Adventures — Play Free in Browser",
  description: GAME_META.description,
};

const ICON_SVG: Record<string, string> = {
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  spotify: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-tc-black flex flex-col items-center px-4 py-12 sm:py-16">

      {/* Title */}
      <div className="text-center mb-8 sm:mb-10">
        <h1
          className="font-pixel text-2xl sm:text-4xl mb-2"
          style={{
            background: "linear-gradient(135deg, #FF006E 0%, #7B2FBE 50%, #4CC9F0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 20px rgba(255,0,110,0.35))",
          }}
        >
          TONE CHAN
        </h1>
        <p className="font-pixel text-[9px] sm:text-[11px] text-tc-cream/50 tracking-widest">ADVENTURES</p>
      </div>

      {/* Emulator */}
      <div className="w-full max-w-lg">
        <EmulatorClientWrapper />
      </div>

      {/* Blurb */}
      <div className="max-w-lg w-full mt-10 sm:mt-12 text-center">
        <p className="text-tc-cream/70 text-sm sm:text-base leading-relaxed">
          {GAME_META.description}
        </p>
      </div>

      {/* Social links */}
      <div className="flex gap-4 mt-8">
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-tc-pink/20 transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-tc-cream/60">
              <path d={ICON_SVG[s.platform] ?? ""} />
            </svg>
          </a>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-10 font-pixel text-[7px] text-tc-cream/20 tracking-widest">
        © {new Date().getFullYear()} TONE CHAN STUDIOS
      </p>

    </main>
  );
}
