// "Find and share API collections" page (the registry Discover screen).
//
// Host-agnostic: pure React + inline styles + CSS variables. The host supplies
// behavior through callbacks, so the SAME component renders in the website and
// inside bruno-app:
//   - website:   onOpenCollection -> route to /@ns/name ; onSearch -> /search?q=
//   - bruno-app: onOpenCollection -> open a registry detail tab ; onSearch -> in-app search
//
// Props:
//   onOpenCollection(collection)      called when a card/row is clicked
//   onSearch(query, filters)          called on hero search submit / category click
//   registries, currentRegistryId     optional; defaults to the public OpenCollection registry
//   onSwitchRegistry, onAddRegistry   optional registry-switcher hooks (reserved)
import React, { useState } from 'react';
import { Icons } from './icons.jsx';
import { Pill, VerifiedBadge, OfficialPill, Row, CollectionCard } from './primitives.jsx';
import { getRegistryData, DEFAULT_REGISTRY } from './registryData.js';

export function FindAndSharePage({
  onOpenCollection,
  onSearch,
  registries,
  currentRegistryId,
  onSwitchRegistry,
  onAddRegistry,
  registryData,
}) {
  const [q, setQ] = useState('');
  const onOpen = onOpenCollection || (() => {});
  const search = onSearch || (() => {});
  const submit = (e) => { e && e.preventDefault && e.preventDefault(); search(q || ''); };

  const currentReg =
    (registries || []).find((r) => r.id === currentRegistryId) ||
    (registries && registries[0]) ||
    DEFAULT_REGISTRY;
  const isPrivate = currentReg.kind === 'private-org' || currentReg.kind === 'private';
  // Host supplies live, git-backed data via `registryData`; fall back to the
  // bundled snapshot so the page still renders if the index hasn't loaded yet.
  const data = registryData || getRegistryData(currentReg);
  const featured = data.featured;
  const trending = data.trending;
  const categories = data.categories;

  return (
    <div style={{ overflow: 'auto', height: '100%', background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div style={{
        padding: '40px 56px 32px',
        borderBottom: '1px solid var(--border-1)',
        background: isPrivate ? 'var(--bg-mantle)' : '#fff',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: 'var(--fg-subtext-1)', fontSize: 12 }}>
            <Pill tone={isPrivate ? 'muted' : 'brand'}>{isPrivate ? 'Private · Org-scoped' : 'Public Registry · Beta'}</Pill>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{currentReg.host}</span>
            {currentReg.auth && <span style={{ color: 'var(--fg-subtext-2)' }}>· {currentReg.auth.account}</span>}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 10 }}>
            {isPrivate ? <>Collections inside <span style={{ color: 'var(--brand-text)' }}>{currentReg.name}</span>.</> : 'Find and share API collections.'}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--fg-subtext-2)', maxWidth: 620, lineHeight: 1.55, textWrap: 'pretty', marginBottom: 22 }}>
            {isPrivate
              ? <>Collections here are visible only to members authenticated through {currentReg.auth && currentReg.auth.provider}. Access is managed in your git provider — not in Bruno.</>
              : <>A public, git-native index of Bruno collections. Discover official APIs, install them into your workspace, and publish your own straight from the app.</>
            }
          </p>
          <form onSubmit={submit} style={{
            display: 'flex', alignItems: 'center', maxWidth: 560,
            border: '1px solid var(--border-1)', borderRadius: 6, background: '#fff',
            boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
          }}>
            <span style={{ padding: '0 10px 0 14px', color: 'var(--fg-subtext-1)' }}><Icons.Search size={16}/></span>
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${data.totalCollections.toLocaleString()} collections${isPrivate ? '' : ' — e.g. stripe, graphql, oauth…'}`}
              style={{
                flex: 1, padding: '11px 0', border: 0, outline: 0, fontSize: 13,
                background: 'transparent', color: 'var(--fg-base)',
              }}/>
            <span style={{
              padding: '4px 8px', marginRight: 6, fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--fg-subtext-1)', border: '1px solid var(--border-1)', borderRadius: 4,
            }}>⌘K</span>
          </form>
          <div style={{ display: 'flex', gap: 16, marginTop: 18, fontSize: 12, color: 'var(--fg-subtext-1)' }}>
            <span><strong style={{ color: 'var(--fg-base)', fontWeight: 600 }}>{data.totalCollections.toLocaleString()}</strong> collections</span>
            <span><strong style={{ color: 'var(--fg-base)', fontWeight: 600 }}>{data.publishers}</strong> {isPrivate ? 'internal publishers' : 'publishers'}</span>
            <span><strong style={{ color: 'var(--fg-base)', fontWeight: 600 }}>{categories.length}</strong> categories</span>
          </div>
        </div>
      </div>

      {/* Featured */}
      <Section title="Featured" right={<a style={{ fontSize: 12, color: 'var(--link)' }}>View all →</a>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {featured.map((c) => <CollectionCard key={c.ns + '/' + c.name} c={c} onOpen={onOpen} />)}
        </div>
      </Section>

      {/* Trending + Categories columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, padding: '0 56px 48px', maxWidth: 1160, margin: '0 auto', width: '100%' }}>
        <div>
          <SectionHeader title="Trending this week" right={<a style={{ fontSize: 12, color: 'var(--link)' }}>View all →</a>} />
          <div style={{ border: '1px solid var(--border-1)', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
            {trending.map((c, i) => (
              <TrendingRow key={c.ns + '/' + c.name} c={c} rank={i + 1} onOpen={onOpen} last={i === trending.length - 1} />
            ))}
          </div>
        </div>

        <aside>
          <SectionHeader title="Browse by category" />
          <div style={{ display: 'grid', gap: 6 }}>
            {categories.map((cat) => (
              <Row key={cat.id} onClick={() => search('', { category: cat.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                  border: '1px solid var(--border-1)', borderRadius: 6, background: '#fff',
                }}>
                <CategoryIcon name={cat.icon} />
                <span style={{ fontSize: 13, flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 11, color: 'var(--fg-subtext-1)' }}>{cat.count}</span>
              </Row>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children, right }) {
  return (
    <div style={{ padding: '28px 56px 8px', maxWidth: 1160, margin: '0 auto', width: '100%' }}>
      <SectionHeader title={title} right={right} />
      {children}
    </div>
  );
}

function SectionHeader({ title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h3>
      {right}
    </div>
  );
}

function TrendingRow({ c, rank, onOpen, last }) {
  return (
    <Row onClick={() => onOpen(c)} style={{
      display: 'grid', gridTemplateColumns: '28px 36px 1fr auto', gap: 12, alignItems: 'center',
      padding: '12px 14px', borderBottom: last ? 'none' : '1px solid var(--border-1)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--fg-subtext-0)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>#{rank}</span>
      <div style={{
        width: 28, height: 28, borderRadius: 5, background: 'var(--bg-surface-0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-subtext-1)',
        fontWeight: 700, fontSize: 12, fontFamily: 'var(--font-mono)',
      }}>{c.ns[0].toUpperCase()}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{c.title}</span>
          {c.verified && <VerifiedBadge />}
          {c.official && <OfficialPill />}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-subtext-1)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {c.tagline}
        </div>
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {(c.langs || []).map((l) => (
          <span key={l} style={{
            fontSize: 10.5, color: 'var(--fg-subtext-1)', background: 'var(--bg-surface-0)',
            padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-mono)',
          }}>{l}</span>
        ))}
      </span>
    </Row>
  );
}

function CategoryIcon({ name }) {
  const map = { sparkle: Icons.Sparkle, key: Icons.Key, server: Icons.Server, message: Icons.Message, chart: Icons.Chart, box: Icons.Box, card: Icons.Card, layout: Icons.Layout };
  const I = map[name] || Icons.Package;
  return <span style={{
    width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-crust)', color: 'var(--fg-subtext-1)', borderRadius: 4,
  }}><I size={13}/></span>;
}

export default FindAndSharePage;
