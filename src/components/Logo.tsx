/**
 * Dentista na Nuvem — Logo
 *
 * Mark concept: a single continuous stroke following the horizon of three soft
 * cloud forms seen from below. The line reads simultaneously as:
 *   · nuvem (cloud / cloud technology)
 *   · aspiration — looking upward toward change
 *   · warmth — the organic arc echoes a quiet smile
 *
 * One stroke. No fill. No gradient. Works on any background, at any size,
 * in any colour — monochromatic, inverted, embossed.
 *
 * viewBox 0 0 56 50 → compact, nearly-square format.
 *   At size=32 px (height): 36 × 32 px  — tight nav mark
 *   At size=40 px (height): 45 × 40 px  — comfortable hero mark
 */

import React from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const VB_W = 56;
const VB_H = 50;

/**
 * Three-hump cloud horizon path.
 *
 * Geometry (all values in viewBox units):
 *   baseline   y = 44
 *   left shoulder   x = 18, y = 22
 *   center peak     x = 28, y = 10   ← tallest
 *   right shoulder  x = 38, y = 22
 *
 * Cubic-bezier tangents are horizontal at every junction → C1 continuity →
 * a single, seamless S-wave with no visible kinks.
 */
// ─── Types ────────────────────────────────────────────────────────────────────

export interface LogoProps {
  /**
   * `'icon'`    — mark only (SVG)
   * `'full'`    — mark + wordmark side-by-side (inline)
   * `'stacked'` — mark above wordmark (editorial / social / hero)
   */
  variant?: 'icon' | 'full' | 'stacked';
  /** Mark height in px. Width is derived from the 56 × 50 viewBox ratio. */
  size?: number;
  /**
   * Stroke / text colour.
   * Default: `'#FF8C00'` (brand orange).
   * Pass `'currentColor'` to inherit from the surrounding text colour.
   */
  color?: string;
  /** Override the wordmark colour separately (defaults to `color`). */
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Logo({
  variant   = 'icon',
  size      = 36,
  color     = '#FF8C00',
  textColor,
  className = '',
  style,
}: LogoProps) {
  const h   = size;
  const w   = Math.round(size * (VB_W / VB_H));   // ≈ size × 1.12 — nearly square
  const txt = textColor ?? color;

  // ── The mark ────────────────────────────────────────────────────────────────
  const mark = (extraProps: React.ImgHTMLAttributes<HTMLImageElement> = {}) => (
    <img
      src="/icone.png"
      alt="Dentista na Nuvem"
      width={w}
      height={h}
      style={{ objectFit: 'contain' }}
      {...extraProps}
    />
  );

  // ── Icon only ───────────────────────────────────────────────────────────────
  if (variant === 'icon') {
    return mark({ className, style: style });
  }

  // ── Inline: mark left, wordmark right ───────────────────────────────────────
  if (variant === 'full') {
    return (
      <span
        className={`inline-flex items-center gap-3 ${className}`}
        style={style}
      >
        {mark()}
        <span
          style={{
            fontSize:      `${Math.round(size * 0.55)}px`,
            fontWeight:    800,
            lineHeight:    1.1,
            letterSpacing: '0em',
            fontFamily:    "'Nunito', sans-serif",
          }}
        >
          <span style={{ color: '#ffffff' }}>Dentista </span>
          <span style={{ color: txt }}>na Nuvem</span>
        </span>
      </span>
    );
  }

  // ── Stacked: mark centred above, wordmark below ──────────────────────────────
  // Editorial format — for hero sections, social media, print.
  return (
    <span
      className={`inline-flex flex-col items-center gap-2 ${className}`}
      style={style}
    >
      {mark()}
      <span
        style={{
          fontSize:      `${Math.round(size * 0.28)}px`,
          fontWeight:    700,
          letterSpacing: '0.28em',
          textTransform: 'uppercase' as const,
          color:         txt,
          fontFamily:    'inherit',
          whiteSpace:    'nowrap' as const,
        }}
      >
        Dentista na Nuvem
      </span>
    </span>
  );
}
