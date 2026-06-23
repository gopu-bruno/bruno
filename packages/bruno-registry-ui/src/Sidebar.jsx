// App-shell sidebar — logo + navigation.
// Host-agnostic: the host passes the active item and an onSelect callback, so
// the same sidebar mounts in the website and (later) inside bruno-app's surface.
// Only "Browse" exists today — it maps to the find/share page we already have.
import React, { useState } from 'react';
import { Icons } from './icons.jsx';

const NAV_ITEMS = [
  { id: 'browse', label: 'Browse', icon: Icons.Globe },
];

export function Sidebar({ active = 'browse', onSelect, onPublish }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0, height: '100%',
      borderRight: '1px solid var(--border-1)', background: 'var(--bg-mantle)',
      display: 'flex', flexDirection: 'column', padding: '16px 12px',
    }}>
      <Logo />
      <nav style={{ marginTop: 22, display: 'grid', gap: 2 }}>
        {NAV_ITEMS.map((it) => (
          <NavItem key={it.id} item={it} active={active === it.id} onClick={() => onSelect && onSelect(it.id)} />
        ))}
      </nav>
      {onPublish && (
        <button
          onClick={onPublish}
          style={{
            marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-1)', cursor: 'pointer',
            background: '#fff', color: 'var(--fg-base)', fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
          }}>
          <Icons.Upload size={14} /> Publish
        </button>
      )}
    </aside>
  );
}

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7, background: 'var(--brand)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0,
      }}>
        <Icons.Package size={16} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, minWidth: 0 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--fg-base)' }}>OpenCollection</span>
        <span style={{ fontSize: 10, color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)' }}>registry</span>
      </div>
    </div>
  );
}

function NavItem({ item, active, onClick }) {
  const [hover, setHover] = useState(false);
  const I = item.icon;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left',
        padding: '7px 10px', borderRadius: 6, border: 0, cursor: 'pointer',
        background: active ? 'var(--brand-soft)' : (hover ? 'var(--bg-surface-0)' : 'transparent'),
        color: active ? 'var(--brand-text)' : 'var(--fg-subtext-2)',
        fontSize: 13, fontWeight: active ? 600 : 500, fontFamily: 'inherit',
        transition: 'background 0.12s, color 0.12s',
      }}>
      <I size={15} /> {item.label}
    </button>
  );
}

export default Sidebar;
