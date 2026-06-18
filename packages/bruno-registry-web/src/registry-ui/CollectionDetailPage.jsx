// Collection detail page — opened when a card/row on the find page is clicked.
//
// Host-agnostic: takes a collection (an index entry) + callbacks. The website
// passes web behavior (copy install command, open repo); bruno-app would pass
// a real install-into-workspace handler. Shows ONLY real data from the index
// entry plus the git source — request contents are fetched from the source repo
// at install time, so we don't fabricate a request list here.
import React, { useState } from 'react';
import { Icons } from './icons.jsx';
import { VerifiedBadge, OfficialPill, Btn } from './primitives.jsx';

const CATEGORY_LABELS = {
  payments: 'Payments', ai: 'AI & ML', auth: 'Auth & Identity', devops: 'DevOps & Infra',
  comms: 'Communications', data: 'Data & Analytics', storage: 'Storage & CDN', productivity: 'Productivity',
};

export function CollectionDetailPage({ collection, onBack, onInstall }) {
  if (!collection) return null;
  const c = collection;
  const slug = `${c.ns}/${c.name}`;
  const repo = c.source && c.source.repo;
  const installCmd = `bruno install ${slug}`;

  return (
    <div style={{ overflow: 'auto', height: '100%', background: 'var(--bg-base)' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '18px 56px 0' }}>
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, border: 0, background: 'transparent',
          cursor: 'pointer', color: 'var(--fg-subtext-1)', fontSize: 12.5, fontFamily: 'inherit', padding: 0,
        }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>←</span> Browse
        </button>
      </div>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-1)', padding: '16px 56px 28px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12, background: c.color || 'var(--bg-surface-0)',
            color: c.color ? '#fff' : 'var(--fg-subtext-1)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 24, flexShrink: 0, fontFamily: 'var(--font-mono)',
          }}>{c.ns[0].toUpperCase()}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>{c.title}</h1>
              {c.verified && <VerifiedBadge size={16} />}
              {c.official && <OfficialPill />}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>{slug}</div>
            <p style={{ fontSize: 14, color: 'var(--fg-subtext-2)', lineHeight: 1.55, marginTop: 12, maxWidth: 620, textWrap: 'pretty' }}>
              {c.tagline}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
              {(c.langs || []).map((l) => (
                <span key={l} style={{
                  fontSize: 11, color: 'var(--fg-subtext-1)', background: 'var(--bg-surface-0)',
                  padding: '3px 9px', borderRadius: 5, fontFamily: 'var(--font-mono)',
                }}>{l}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <Btn variant="primary" size="lg" icon={<Icons.Download size={14} />} onClick={onInstall}>Add to Bruno</Btn>
            {repo && (
              <a href={repo} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <Btn variant="secondary" size="lg" icon={<Icons.Github size={14} />} full>View source</Btn>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        maxWidth: 1000, margin: '0 auto', width: '100%', padding: '28px 56px 48px',
        display: 'grid', gridTemplateColumns: '1fr 280px', gap: 36,
      }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Install</h3>
          <InstallCommand command={installCmd} />
          <p style={{ fontSize: 12.5, color: 'var(--fg-subtext-1)', lineHeight: 1.55, marginTop: 14 }}>
            Requests are fetched from the source repository at install time and written into your workspace as
            native <span style={{ fontFamily: 'var(--font-mono)' }}>.bru</span> files. Nothing runs on install.
          </p>
        </div>

        <aside>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Details</h3>
          <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
            <Detail label="Publisher" value={c.ns} />
            {c.category && <Detail label="Category" value={CATEGORY_LABELS[c.category] || c.category} />}
            {c.langs && c.langs.length > 0 && <Detail label="Languages" value={c.langs.join(', ')} />}
            {repo && (
              <Detail label="Source" value={
                <a href={repo} target="_blank" rel="noreferrer" style={{ color: 'var(--link)', textDecoration: 'none', wordBreak: 'break-all' }}>
                  {repo.replace(/^https?:\/\//, '')}
                </a>
              } />
            )}
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt style={{ fontSize: 11, color: 'var(--fg-subtext-0)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{label}</dt>
      <dd style={{ fontSize: 13, color: 'var(--fg-base)', margin: 0 }}>{value}</dd>
    </div>
  );
}

function InstallCommand({ command }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(command).then(() => setCopied(true)).catch(() => {});
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      border: '1px solid var(--border-1)', borderRadius: 6, background: 'var(--bg-crust)',
      padding: '10px 12px 10px 14px',
    }}>
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-base)' }}>
        <span style={{ color: 'var(--fg-subtext-0)' }}>$ </span>{command}
      </code>
      <button onClick={copy} title="Copy" style={{
        border: '1px solid var(--border-1)', background: 'var(--bg-base)', borderRadius: 5,
        padding: '4px 10px', cursor: 'pointer', fontSize: 11.5, color: 'var(--fg-subtext-1)',
        fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5,
      }}>
        {copied ? <Icons.Check size={12} /> : <Icons.Command size={12} />}{copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default CollectionDetailPage;
