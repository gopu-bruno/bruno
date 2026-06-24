// Collection detail page — opened when a card/row on the find page is clicked.
//
// Host-agnostic: takes a collection (an index entry) + callbacks. The website
// passes web behavior (copy install command, open repo); bruno-app would pass
// a real install-into-workspace handler. Shows ONLY real data from the index
// entry plus the git source — request contents are fetched from the source repo
// at install time, so we don't fabricate a request list here.
import React, { useState } from 'react';
import { Icons } from './icons.jsx';
import { VerifiedBadge, OfficialPill, Btn, DownloadStat } from './primitives.jsx';
import { sortedVersions, latestVersionEntry, latestVersionLabel, gitSourceOf } from './registryData.js';

const CATEGORY_LABELS = {
  payments: 'Payments', ai: 'AI & ML', auth: 'Auth & Identity', devops: 'DevOps & Infra',
  comms: 'Communications', data: 'Data & Analytics', storage: 'Storage & CDN', productivity: 'Productivity',
};

export function CollectionDetailPage({
  collection,
  onBack,
  onInstall,
  // Host-specific install affordances. The desktop app clones the source repo
  // (or downloads the url artifact) into the workspace, so it passes a truthful
  // command and label; the website keeps its own defaults.
  installLabel = 'Add to Bruno',
  installCommand,
  // Install count from the separate public API; null/undefined hides the stat.
  installCount
}) {
  if (!collection) return null;
  const c = collection;
  const slug = `${c.ns}/${c.name}`;
  const versions = sortedVersions(c);
  const latest = latestVersionEntry(c);
  const latestLabel = latestVersionLabel(c);
  // Resolve the latest version's source. For git we can link to the repo (at the
  // subdir/ref); for url we link to the artifact directly.
  const git = gitSourceOf(latest);
  const repo = git && git.repo;
  const subdir = git && git.subdir ? git.subdir : '';
  const ref = (git && git.ref) || 'main';
  const sourceUrl = repo
    ? (subdir ? `${repo}/tree/${ref}/${subdir}` : repo)
    : (latest && latest.type === 'url' ? (latest.source && latest.source.url) : null);
  const sourceLabel = repo
    ? `${repo.replace(/^https?:\/\//, '')}${subdir ? '/' + subdir : ''}`
    : (latest && latest.type === 'url' ? (latest.source && latest.source.url) : '');
  const installCmd = installCommand || `bruno install ${slug}`;

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
            {(installCount != null || latestLabel || versions.length > 0) && (
              <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center', marginTop: 16, fontSize: 12.5, color: 'var(--fg-subtext-1)' }}>
                {installCount != null && <DownloadStat value={installCount} label="installs" />}
                {latestLabel && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icons.GitBranch size={13} />
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-base)' }}>v{latestLabel}</span>
                  </span>
                )}
                {versions.length > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icons.GitCommit size={13} /> {versions.length} {versions.length === 1 ? 'version' : 'versions'}
                  </span>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <Btn variant="primary" size="lg" icon={<Icons.GitBranch size={14} />} onClick={onInstall}>{installLabel}</Btn>
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
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
            The collection is fetched from the selected version's source at install time and written into your
            workspace as native <span style={{ fontFamily: 'var(--font-mono)' }}>.bru</span> files. Nothing runs on install.
          </p>

          {/* Versions are authored in the registry entry — each independently
              sourced from a git repo or a hosted url. Latest is by semver. */}
          {versions.length > 0 ? (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                Versions <span style={{ color: 'var(--fg-subtext-1)', fontWeight: 400 }}>({versions.length})</span>
              </h3>
              <div style={{ border: '1px solid var(--border-1)', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
                {versions.map((v, i) => {
                  const g = gitSourceOf(v);
                  const where = g
                    ? `${g.repo.replace(/^https?:\/\//, '')}${g.subdir ? '/' + g.subdir : ''}${g.ref ? ' @ ' + g.ref : ''}`
                    : (v.source && v.source.url) || '';
                  return (
                    <div key={v.version} style={{
                      display: 'flex', gap: 14, alignItems: 'center', padding: '12px 16px',
                      borderBottom: i === versions.length - 1 ? 'none' : '1px solid var(--border-1)',
                    }}>
                      <div style={{ minWidth: 110 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          v{v.version}
                          {i === 0 && <span style={{ fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--success)', background: 'var(--success-bg)', padding: '1px 5px', borderRadius: 4 }}>Latest</span>}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--fg-subtext-1)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{v.type}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--fg-subtext-2)', lineHeight: 1.45, wordBreak: 'break-all' }}>
                        {where}
                      </div>
                      {v.hash && (
                        <span title={v.hash} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--fg-subtext-1)', flexShrink: 0 }}>
                          <Icons.Check size={12} /> hash
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 32, padding: '20px', border: '1px dashed var(--border-1)', borderRadius: 8, background: 'var(--bg-mantle)', fontSize: 12.5, color: 'var(--fg-subtext-1)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--fg-base)', fontWeight: 600 }}>No versions listed yet.</strong> A version is added via a PR
              to the registry — a <span style={{ fontFamily: 'var(--font-mono)' }}>git</span> or <span style={{ fontFamily: 'var(--font-mono)' }}>url</span> source for the
              collection's <span style={{ fontFamily: 'var(--font-mono)' }}>opencollection.yml</span>.
            </div>
          )}
        </div>

        <aside>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Details</h3>
          <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
            <Detail label="Publisher" value={c.ns} />
            {latestLabel && <Detail label="Latest version" value={<span style={{ fontFamily: 'var(--font-mono)' }}>v{latestLabel}</span>} />}
            {c.category && <Detail label="Category" value={CATEGORY_LABELS[c.category] || c.category} />}
            {c.langs && c.langs.length > 0 && <Detail label="Languages" value={c.langs.join(', ')} />}
            {sourceUrl && (
              <Detail label="Source" value={
                <a href={sourceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--link)', textDecoration: 'none', wordBreak: 'break-all' }}>
                  {sourceLabel}
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
