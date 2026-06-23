// Shared UI primitives — badges, pills, buttons, collection card.
// Pure React + inline styles + CSS variables. Portable to bruno-app as-is.
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './icons.jsx';

// --- Number formatter ---
export const fmtN = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n));

// --- Animated count-up ---------------------------------------------------
// Tweens the displayed number toward `target` whenever it changes, so a count
// that the host nudges upward visibly ticks rather than jumping. Host-agnostic:
// the component only animates the value it's given; the host decides when (and
// how fast) the number grows.
function useCountUp(target, ms = 650) {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);
  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return undefined;
    let start = null;
    const step = (now) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, ms]);
  return val;
}

// Live install/download stat. Renders an animated, comma-grouped number that
// ticks when `value` rises, with a brief green "+N" flash on each increase.
export function DownloadStat({ value = 0, label = 'installs', size = 'lg', icon = true }) {
  const shown = useCountUp(value);
  const prevRef = useRef(value);
  const [delta, setDelta] = useState(0);
  useEffect(() => {
    const d = value - prevRef.current;
    prevRef.current = value;
    if (d > 0) {
      setDelta(d);
      const id = setTimeout(() => setDelta(0), 1100);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [value]);

  const big = size === 'lg';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, position: 'relative' }}>
      {icon && <Icons.Download size={big ? 15 : 13} style={{ color: 'var(--fg-subtext-1)' }} />}
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: big ? 15 : 13, color: 'var(--fg-base)' }}>
        {shown.toLocaleString()}
      </span>
      <span style={{ fontSize: big ? 12.5 : 11.5, color: 'var(--fg-subtext-1)' }}>{label}</span>
      {delta > 0 && (
        <span style={{
          position: 'absolute', left: '100%', marginLeft: 8, whiteSpace: 'nowrap',
          fontSize: 11, fontWeight: 600, color: 'var(--success)',
          animation: 'oc-flash-up 1.1s ease-out forwards', pointerEvents: 'none',
        }}>+{delta.toLocaleString()}</span>
      )}
      <style>{`@keyframes oc-flash-up { 0% { opacity: 0; transform: translateY(4px); } 25% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-6px); } }`}</style>
    </span>
  );
}

// Tiny inline sparkline from an array of numbers (e.g. installs/day).
export function Sparkline({ points = [], width = 180, height = 36, stroke = 'var(--brand)' }) {
  if (!points.length) return null;
  const max = Math.max(...points, 1);
  const min = Math.min(...points);
  const span = Math.max(max - min, 1);
  const coords = points.map((p, i) => {
    const x = (i / Math.max(points.length - 1, 1)) * width;
    const y = height - ((p - min) / span) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = 'M ' + coords.join(' L ');
  return (
    <svg width={width} height={height} style={{ display: 'block', marginTop: 6 }} aria-hidden>
      <path d={`${line} L ${width},${height} L 0,${height} Z`} fill="var(--brand-soft)" stroke="none" />
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

// --- Badges ---
export function VerifiedBadge({ size = 14, title = 'Verified publisher' }) {
  return (
    <span title={title} style={{ display: 'inline-flex', color: 'var(--hue-blue)', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1l2.39 2.16 3.22 -.27 .57 3.18 2.93 1.36 -1.3 2.96 1.3 2.96 -2.93 1.36 -.57 3.18 -3.22 -.27 -2.39 2.16 -2.39 -2.16 -3.22 .27 -.57 -3.18 -2.93 -1.36 1.3 -2.96 -1.3 -2.96 2.93 -1.36 .57 -3.18 3.22 .27z M9 12l2 2 4-4" stroke="#fff" strokeWidth="1.1" fill="currentColor"/>
      </svg>
    </span>
  );
}

export function OfficialPill() {
  return <span style={{
    fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
    color: 'var(--hue-blue)', background: 'hsla(214, 55%, 45%, 0.10)',
    padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap'
  }}>Official</span>;
}

export function CommunityPill() {
  return <span style={{
    fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
    color: 'var(--fg-subtext-1)', background: 'var(--bg-surface-0)',
    padding: '2px 6px', borderRadius: 4
  }}>Community</span>;
}

export function Pill({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: 'var(--bg-surface-0)', fg: 'var(--fg-subtext-1)' },
    muted:   { bg: 'rgba(66, 133, 244, 0.12)', fg: '#3b6fc9' },
    brand:   { bg: 'var(--brand-soft)',   fg: 'var(--brand-text)' },
    success: { bg: 'var(--success-bg)',   fg: 'var(--success)' },
    info:    { bg: 'var(--info-bg)',      fg: 'var(--info)' },
    warn:    { bg: 'var(--warning-bg)',   fg: 'var(--warning)' },
  };
  const t = tones[tone] || tones.neutral;
  return <span style={{
    fontSize: 11, fontWeight: 500, color: t.fg, background: t.bg,
    padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4
  }}>{children}</span>;
}

// --- Buttons ---
export function Btn({ children, onClick, variant = 'primary', size = 'md', icon, style, disabled, full }) {
  const sizes = {
    sm: { pad: '5px 10px', fs: 12 },
    md: { pad: '7px 14px', fs: 13 },
    lg: { pad: '9px 18px', fs: 13 },
  };
  const variants = {
    primary: { bg: 'var(--brand)', fg: '#fff', bd: 'var(--brand)' },
    secondary: { bg: '#fff', fg: 'var(--fg-base)', bd: 'var(--border-1)' },
    ghost: { bg: 'transparent', fg: 'var(--fg-base)', bd: 'transparent' },
    soft: { bg: 'var(--brand-soft)', fg: 'var(--brand-text)', bd: 'transparent' },
    danger: { bg: '#fff', fg: 'var(--danger)', bd: 'var(--border-1)' },
  };
  const s = sizes[size], v = variants[variant];
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: s.pad, fontSize: s.fs, fontWeight: 500,
        background: disabled ? 'var(--bg-surface-0)' : (hover && variant === 'primary' ? 'var(--brand-strong)' : (hover && variant !== 'primary' ? 'var(--bg-mantle)' : v.bg)),
        color: disabled ? 'var(--fg-subtext-0)' : v.fg,
        border: `1px solid ${hover && variant === 'secondary' ? 'var(--border-2)' : v.bd}`,
        borderRadius: 5, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        width: full ? '100%' : undefined, justifyContent: 'center',
        transition: 'background 0.12s, border-color 0.12s',
        fontFamily: 'inherit', ...style,
      }}>
      {icon}{children}
    </button>
  );
}

// --- Modal shell (ported from the design; used by the publish flow) ---------
export function Modal({ children, onClose, width = 520 }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width, maxWidth: '94vw', maxHeight: '92vh', background: '#fff', borderRadius: 8,
        boxShadow: 'var(--shadow-lg)', overflow: 'auto', animation: 'oc-modal-in 0.15s ease',
      }}>
        {children}
      </div>
      <style>{`@keyframes oc-modal-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

export function ModalHeader({ title, sub, onClose }) {
  return (
    <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{title}</h3>
        {sub && <div style={{ fontSize: 12.5, color: 'var(--fg-subtext-1)' }}>{sub}</div>}
      </div>
      {onClose && <button onClick={onClose} style={{ background: 'transparent', border: 0, color: 'var(--fg-subtext-1)', cursor: 'pointer', padding: 4 }}><Icons.X size={16} /></button>}
    </div>
  );
}

export function ModalFooter({ children }) {
  return (
    <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border-1)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      {children}
    </div>
  );
}

export function inputStyle(extra) {
  return {
    padding: '7px 10px', fontSize: 13, border: '1px solid var(--border-1)', borderRadius: 4,
    background: '#fff', color: 'var(--fg-base)', outline: 'none', width: '100%', fontFamily: 'inherit', ...extra,
  };
}

export function Field({ label, children, hint }) {
  return (
    <label style={{ display: 'grid', gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--fg-subtext-1)' }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--fg-subtext-1)' }}>{hint}</span>}
    </label>
  );
}

// --- Hoverable row helper ---
export function Row({ children, onClick, style, hoverBg = 'var(--bg-mantle)' }) {
  const [h, setH] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ background: h ? hoverBg : 'transparent', cursor: onClick ? 'pointer' : 'default', ...style }}>
    {children}
  </div>;
}

// --- Collection card (used across Discover / Search) ---
export function CollectionCard({ c, onOpen, compact }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={() => onOpen && onOpen(c)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        border: `1px solid ${h ? 'var(--border-2)' : 'var(--border-1)'}`,
        borderRadius: 8, background: '#fff', padding: compact ? 14 : 16,
        cursor: 'pointer', transition: 'border-color 0.12s, transform 0.12s',
        transform: h ? 'translateY(-1px)' : 'none',
        display: 'flex', flexDirection: 'column', gap: compact ? 8 : 10,
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 6, background: c.color || 'var(--bg-surface-0)',
          color: c.color ? '#fff' : 'var(--fg-subtext-1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14, flexShrink: 0, fontFamily: 'var(--font-mono)',
        }}>{c.ns[0].toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{c.title}</span>
            {c.verified && <VerifiedBadge />}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)' }}>
            {c.ns}/{c.name}
          </div>
        </div>
        {c.official && <OfficialPill />}
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-subtext-2)', lineHeight: 1.5, textWrap: 'pretty' }}>
        {c.tagline}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
        {(c.langs || []).map((l) => (
          <span key={l} style={{
            fontSize: 10.5, color: 'var(--fg-subtext-1)', background: 'var(--bg-surface-0)',
            padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-mono)',
          }}>{l}</span>
        ))}
        {c.downloads != null && (
          <span style={{
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: 'var(--fg-subtext-1)',
          }}>
            <Icons.Download size={11} /> {fmtN(c.downloads)}
          </span>
        )}
      </div>
    </div>
  );
}
