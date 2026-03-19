import type { Metadata } from "next";
import EmulatorClientWrapper from "@/components/emulator/EmulatorClientWrapper";
import { GAME_META, SOCIAL_LINKS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tone Chan Adventures — Play Free in Browser",
  description: GAME_META.description,
};

const ICON_SVG: Record<string, string> = {
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  spotify:
    "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
        color: "hsl(210,40%,98%)",
        position: "relative",
        overflowX: "hidden",
        background: "#0F0F23",
      }}
    >
      {/* Radial purple glow at top */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 50% at 50% -10%, hsla(271,81%,28%,0.45) 0%, transparent 65%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* CRT scanlines */}
      <div
        className="scanlines"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.35,
        }}
      />

      {/* Floating decorative diamonds */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {([
          { top: "6%",  left: "4%",   size: 12, color: "hsl(330,81%,60%)",  opacity: 0.2 },
          { top: "14%", right: "6%",  size: 9,  color: "hsl(200,98%,60%)",  opacity: 0.15 },
          { top: "40%", left: "2%",   size: 7,  color: "hsl(47,96%,53%)",   opacity: 0.13 },
          { top: "58%", right: "3%",  size: 11, color: "hsl(271,81%,56%)",  opacity: 0.18 },
          { top: "76%", left: "7%",   size: 8,  color: "hsl(326,100%,74%)", opacity: 0.13 },
          { top: "87%", right: "8%",  size: 10, color: "hsl(191,100%,50%)", opacity: 0.14 },
          { top: "28%", left: "93%",  size: 6,  color: "hsl(330,81%,60%)",  opacity: 0.1 },
          { top: "52%", left: "0.5%", size: 5,  color: "hsl(200,98%,60%)",  opacity: 0.1 },
        ] as Array<{ top: string; left?: string; right?: string; size: number; color: string; opacity: number }>).map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: d.top,
              left: d.left,
              right: d.right,
              width: d.size,
              height: d.size,
              border: `1.5px solid ${d.color}`,
              opacity: d.opacity,
              transform: "rotate(45deg)",
            }}
          />
        ))}
      </div>

      {/* Page content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 860,
          margin: "0 auto",
          padding: "52px 20px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >

        {/* ── Hero Title ─────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          {/* PRESS START badge */}
          <div
            className="font-pixel neon-pulse"
            style={{
              fontSize: "clamp(0.4rem, 1.5vw, 0.55rem)",
              color: "hsl(47,96%,53%)",
              letterSpacing: "0.25em",
              marginBottom: 20,
              textShadow: "0 0 10px hsl(47,96%,53%), 0 0 20px hsl(47,96%,53%)",
            }}
          >
            ★ INSERT COIN ★
          </div>

          {/* Main title */}
          <h1
            className="font-pixel glitch-title"
            style={{
              fontSize: "clamp(1.2rem, 6vw, 2.6rem)",
              lineHeight: 1.25,
              color: "hsl(326,100%,74%)",
              textShadow:
                "0 0 20px hsl(326,100%,74%), 0 0 40px hsl(271,81%,56%), 3px 3px 0px hsl(200,98%,60%)",
              marginBottom: 14,
              letterSpacing: "0.05em",
            }}
          >
            TONE CHAN
          </h1>

          {/* Subtitle */}
          <h2
            className="font-pixel"
            style={{
              fontSize: "clamp(0.55rem, 2.5vw, 1rem)",
              color: "hsl(200,98%,60%)",
              textShadow: "0 0 14px hsl(200,98%,60%), 0 0 28px hsl(200,98%,40%)",
              letterSpacing: "0.3em",
              fontWeight: 400,
            }}
          >
            ADVENTURES
          </h2>
        </div>

        {/* ── Console / Emulator ─────────────────────────────────────── */}
        <div style={{ width: "100%", maxWidth: 500, position: "relative" }}>
          {/* Purple glow halo */}
          <div
            style={{
              position: "absolute",
              inset: -24,
              background:
                "radial-gradient(ellipse, hsla(271,81%,56%,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: -1,
              borderRadius: "50%",
            }}
          />
          {/* Console card */}
          <div
            style={{
              background: "hsl(222,84%,5%)",
              border: "1px solid hsl(271,50%,28%)",
              borderRadius: 20,
              padding: "8px 8px 16px",
              boxShadow:
                "0 0 0 1px hsla(271,81%,56%,0.08), 0 0 32px hsla(271,81%,56%,0.18), 0 0 80px hsla(330,81%,60%,0.07), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <EmulatorClientWrapper />
          </div>
        </div>

        {/* ── Controls legend ────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginTop: 22,
          }}
        >
          {[
            { label: "D-PAD", desc: "Move",   color: "hsl(271,81%,66%)" },
            { label: "B",     desc: "Attack",  color: "hsl(0,72%,61%)"   },
            { label: "A",     desc: "Jump",    color: "hsl(200,98%,65%)" },
            { label: "START", desc: "Pause",   color: "hsl(47,96%,60%)"  },
          ].map(({ label, desc, color }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "hsla(271,50%,8%,0.8)",
                border: `1px solid ${color}33`,
                borderRadius: 6,
                padding: "5px 11px",
              }}
            >
              <span
                className="font-pixel"
                style={{
                  fontSize: "clamp(0.33rem, 1.1vw, 0.48rem)",
                  color,
                  textShadow: `0 0 8px ${color}`,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "hsl(217.9,10.6%,58%)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {desc}
              </span>
            </div>
          ))}
        </div>

        {/* ── Pixel divider ──────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            width: "100%",
            maxWidth: 480,
            margin: "38px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: "linear-gradient(90deg, transparent, hsl(271,50%,30%))",
            }}
          />
          <span
            className="font-pixel"
            style={{
              fontSize: "0.38rem",
              color: "hsl(271,81%,56%)",
              textShadow: "0 0 8px hsl(271,81%,56%)",
              letterSpacing: "0.3em",
            }}
          >
            ◆ ◆ ◆
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "linear-gradient(90deg, hsl(271,50%,30%), transparent)",
            }}
          />
        </div>

        {/* ── Description card ───────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            background: "hsla(222,84%,5%,0.9)",
            border: "1px solid hsl(271,30%,18%)",
            borderRadius: 14,
            padding: "24px 28px",
            boxShadow: "0 4px 32px hsla(271,81%,56%,0.07), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Card header */}
          <div
            className="font-pixel"
            style={{
              fontSize: "0.38rem",
              color: "hsl(47,96%,53%)",
              letterSpacing: "0.2em",
              marginBottom: 14,
              textShadow: "0 0 8px hsl(47,96%,53%)",
            }}
          >
            ◆ ABOUT THE GAME
          </div>
          <p
            style={{
              textAlign: "left",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              lineHeight: 1.8,
              color: "hsl(217.9,10.6%,72%)",
              margin: 0,
            }}
          >
            {GAME_META.description}
          </p>
        </div>

        {/* ── Social links ───────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="social-icon"
              style={{
                width: 52,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: "hsla(271,50%,8%,0.9)",
                border: "1px solid hsl(271,40%,22%)",
                transition: "box-shadow 0.25s, border-color 0.25s",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={22}
                height={22}
                style={{
                  fill: "hsl(217.9,10.6%,65%)",
                  transition: "fill 0.25s",
                }}
              >
                <path d={ICON_SVG[s.platform] ?? ""} />
              </svg>
            </a>
          ))}
        </div>

        {/* ── Copyright ──────────────────────────────────────────────── */}
        <p
          className="font-pixel"
          style={{
            marginTop: 52,
            fontSize: "0.38rem",
            letterSpacing: "0.18em",
            color: "hsl(271,30%,28%)",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} TONE CHAN STUDIOS
        </p>
      </div>
    </main>
  );
}
