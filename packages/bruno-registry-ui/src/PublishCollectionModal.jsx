// Publish a collection to the registry. In the hybrid model there is no
// "release" step — publishing is a single act: open a PR that either
//
//   • LISTS a new collection  → creates collection/<letter>/<ns>/<name>.json, or
//   • ADDS a version          → appends a {version, type, source, hash?} to an
//                               already-listed collection's file.
//
// Each version is independently sourced: `git` (clone a repo at a ref) or `url`
// (download a hosted opencollection.yml). Listing metadata is collected only
// when the picked collection isn't already in the index. Host-agnostic via
// callbacks.
//
// Props:
//   onClose()
//   onPublish(payload)                         emit mode (website): artifacts generated
//   onOpenRegistryPr(payload) => {prUrl,viaFork}   app: open the PR
//   localCollections                           [{uid,name,pathname}] to pick (app)
//   onResolveCollectionMeta(c) => {repo,subdir,owner}   prefill from git (app)
//   registryEntries                            index entries, to detect "already listed"
//   initialMeta
import React, { useState } from 'react';
import { Icons } from './icons.jsx';
import { Modal, ModalHeader, ModalFooter, Field, inputStyle, Btn, Pill } from './primitives.jsx';
import { buildRegistryEntry, buildVersionEntry, registryEntryPath, parseGithubRepo } from './registryData.js';

const CATEGORIES = [
  ['payments', 'Payments'], ['ai', 'AI & ML'], ['auth', 'Auth & Identity'], ['devops', 'DevOps & Infra'],
  ['comms', 'Communications'], ['data', 'Data & Analytics'], ['storage', 'Storage & CDN'], ['productivity', 'Productivity'],
];

const slug = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');

export function PublishCollectionModal({
  onClose, onPublish, onOpenRegistryPr,
  localCollections, onResolveCollectionMeta, registryEntries, initialMeta,
}) {
  const canPr = typeof onOpenRegistryPr === 'function';
  const hasPicker = canPr && Array.isArray(localCollections) && localCollections.length > 0;

  const [meta, setMeta] = useState({
    ns: '', name: '', title: '', tagline: '', category: 'payments',
    version: '1.0.0', type: 'git',
    repo: '', subdir: '', ref: '', url: '', hash: '',
    langs: '', pat: '',
    ...initialMeta,
  });
  const [step, setStep] = useState(hasPicker ? 'pick' : 'form');
  const [selected, setSelected] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const set = (k, v) => setMeta((m) => ({ ...m, [k]: v }));

  const entry = buildRegistryEntry(meta);
  const version = buildVersionEntry(meta);
  const entryPath = registryEntryPath(entry);
  const entryJson = JSON.stringify(entry, null, 2);
  const repoOk = meta.type !== 'git' || !!parseGithubRepo(meta.repo);

  const findListed = (ns, name) => (registryEntries || []).find((e) => e && e.ns === ns && e.name === name);
  const alreadyListed = !!findListed(meta.ns.trim(), meta.name.trim());

  const sourceOk = meta.type === 'git' ? repoOk : !!meta.url.trim();
  const versionOk = !!meta.version.trim() && sourceOk;
  const listingOk = alreadyListed || (meta.ns.trim() && meta.name.trim() && meta.title.trim());
  const formOk = versionOk && listingOk && (!canPr || meta.pat.trim());

  const chooseCollection = async (c) => {
    setSelected(c);
    setMeta((m) => ({ ...m, name: m.name || slug(c.name), title: m.title || c.name }));
    setStep('form');
    if (!onResolveCollectionMeta) return;
    setResolving(true);
    try {
      const extra = await onResolveCollectionMeta(c);
      const repo = (extra && extra.repo) || '';
      const subdir = extra && extra.subdir != null ? extra.subdir : '';
      const owner = (extra && extra.owner) || '';
      const name = slug(c.name);
      const listed = owner ? findListed(owner, name) : null;
      setMeta((m) => ({
        ...m,
        repo: repo || m.repo,
        subdir: subdir != null ? subdir : m.subdir,
        ns: (listed && listed.ns) || m.ns || owner,
        name: (listed && listed.name) || m.name || name,
        title: (listed && listed.title) || m.title || c.name,
        tagline: (listed && listed.tagline) || m.tagline,
        category: (listed && listed.category) || m.category,
      }));
    } catch {
      /* leave for manual entry */
    } finally {
      setResolving(false);
    }
  };

  const submit = async () => {
    setError(null);
    if (!formOk) return;
    if (!canPr) {
      // Emit mode (website): just surface the artifacts.
      setStep('done');
      if (onPublish) onPublish({ entry, version, entryPath, alreadyListed });
      return;
    }
    setStep('submitting');
    try {
      const res = await onOpenRegistryPr({ entry, version, alreadyListed, meta });
      setResult(res || {});
      setStep('done');
    } catch (e) {
      setError((e && e.message) || 'Failed to open the registry PR.');
      setStep('form');
    }
  };

  const stepperSteps = ['Select', 'Publish'];
  const stepperCurrent = step === 'pick' ? 1 : step === 'form' ? 2 : 0;

  return (
    <Modal onClose={onClose} width={620}>
      {step === 'pick' ? (
        <>
          <ModalHeader title="Publish a collection" sub="Pick a collection from your workspace to publish to the registry." onClose={onClose} />
          <PublishStepper steps={stepperSteps} current={stepperCurrent} />
          <div style={{ padding: '14px 22px', display: 'grid', gap: 8, maxHeight: '60vh', overflow: 'auto' }}>
            {localCollections.map((c) => (
              <button key={c.uid || c.name} onClick={() => chooseCollection(c)} style={{
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%',
                padding: '12px 14px', border: '1px solid var(--border-1)', borderRadius: 6,
                background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <Icons.Folder size={18} style={{ color: 'var(--fg-subtext-1)', flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, display: 'block' }}>{c.name}</span>
                  {c.pathname && <span style={{ fontSize: 11, color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.pathname}</span>}
                </span>
                <Icons.ChevRight size={14} style={{ color: 'var(--fg-subtext-2)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
          <ModalFooter><Btn variant="ghost" onClick={onClose}>Cancel</Btn></ModalFooter>
        </>
      ) : step === 'form' ? (
        <>
          <ModalHeader
            title={alreadyListed ? 'Add a version' : 'Publish a collection'}
            sub={alreadyListed
              ? 'This collection is listed — opening a PR appends a new version to it.'
              : 'Opens a PR that lists the collection and its first version on the registry.'}
            onClose={onClose}
          />
          {hasPicker && <PublishStepper steps={stepperSteps} current={stepperCurrent} />}
          {selected && (
            <div style={{ padding: '10px 22px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-subtext-1)' }}>
              <Icons.Folder size={13} /> Publishing <strong style={{ color: 'var(--fg-base)', fontWeight: 600 }}>{selected.name}</strong>
              {alreadyListed ? <Pill tone="success">Listed</Pill> : <Pill tone="muted">Not listed yet</Pill>}
              {hasPicker && <button onClick={() => setStep('pick')} style={{ marginLeft: 'auto', background: 'transparent', border: 0, color: 'var(--link)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Change</button>}
            </div>
          )}

          <div style={{ padding: '18px 22px', display: 'grid', gap: 14, maxHeight: '62vh', overflow: 'auto' }}>
            {resolving && (
              <div style={{ fontSize: 11.5, color: 'var(--fg-subtext-1)', display: 'flex', gap: 6, alignItems: 'center' }}>
                <Icons.GitBranch size={12} /> Resolving repo &amp; subdir from the collection’s git remote…
              </div>
            )}
            {!alreadyListed && <ListingFields meta={meta} set={set} />}
            <VersionFields meta={meta} set={set} repoOk={repoOk} />
            {canPr && (
              <Field label="GitHub token" hint="Opens the PR on your behalf. Needs public_repo (or write to the registry). Not stored.">
                <input type="password" value={meta.pat} onChange={(e) => set('pat', e.target.value)} placeholder="ghp_…" autoComplete="off" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
              </Field>
            )}
            <div style={{ fontSize: 11.5, color: 'var(--fg-subtext-1)', display: 'flex', gap: 7, alignItems: 'center' }}>
              <Icons.GitBranch size={13} style={{ flexShrink: 0 }} /> Entry:&nbsp;
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-base)', background: 'var(--bg-crust)', padding: '1px 6px', borderRadius: 3, wordBreak: 'break-all' }}>{entryPath}</code>
            </div>
            {error && <ErrorNote>{error}</ErrorNote>}
          </div>

          <ModalFooter>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn variant="primary" onClick={submit} disabled={!formOk}>
              {canPr ? (alreadyListed ? 'Open version PR' : 'Open registry PR') : 'Generate entry'}
            </Btn>
          </ModalFooter>
        </>
      ) : step === 'submitting' ? (
        <>
          <ModalHeader title="Opening PR…" sub={entryPath} />
          <div style={{ padding: '34px 22px', textAlign: 'center', fontSize: 13, color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)' }}>
            Creating branch · {alreadyListed ? 'appending version' : 'adding entry'} · opening pull request…
          </div>
        </>
      ) : canPr ? (
        // App "done" — PR opened.
        <>
          <ModalHeader title="PR opened" sub={entryPath} onClose={onClose} />
          <div style={{ padding: '18px 22px', display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icons.Check size={16} /></span>
              <span>{alreadyListed ? `Version ${meta.version} added` : 'Listing'} — once a maintainer merges, it appears on the find page.</span>
            </div>
            {result && result.prUrl && (
              <a href={result.prUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--link)', fontSize: 12.5, wordBreak: 'break-all' }}>
                {result.prUrl}{result.viaFork ? ' (from your fork)' : ''}
              </a>
            )}
          </div>
          <ModalFooter><Btn variant="primary" onClick={onClose}>Close</Btn></ModalFooter>
        </>
      ) : (
        // Emit-mode "done" (website): the entry to add via PR.
        <>
          <ModalHeader title="Ready to publish" sub="Add this entry to the registry via a pull request." onClose={onClose} />
          <div style={{ padding: '18px 22px', display: 'grid', gap: 18 }}>
            <CopyBlock label={<>Registry entry <span style={{ color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)', fontWeight: 400 }}>{entryPath}</span></>} text={entryJson} hint="Add this file (or append the version to the existing file) via a PR to the registry repo." mono />
          </div>
          <ModalFooter>
            <Btn variant="ghost" onClick={() => setStep('form')}>Back</Btn>
            <Btn variant="primary" onClick={onClose}>Done</Btn>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}

// Listing metadata — collected only the first time a collection is published.
function ListingFields({ meta, set }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Publisher (ns)" hint="Your owner/org handle.">
          <input value={meta.ns} onChange={(e) => set('ns', e.target.value)} placeholder="stripe" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
        </Field>
        <Field label="Collection name">
          <input value={meta.name} onChange={(e) => set('name', e.target.value)} placeholder="stripe-api" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
        </Field>
      </div>
      <Field label="Display title">
        <input value={meta.title} onChange={(e) => set('title', e.target.value)} placeholder="Stripe API" style={inputStyle()} />
      </Field>
      <Field label="Tagline" hint="One sentence shown in search.">
        <textarea value={meta.tagline} onChange={(e) => set('tagline', e.target.value)} rows={2} placeholder="Payments, customers and webhooks for the Stripe REST API." style={inputStyle({ minHeight: 52, resize: 'vertical' })} />
      </Field>
      <Field label="Category">
        <select value={meta.category} onChange={(e) => set('category', e.target.value)} style={inputStyle()}>
          {CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </Field>
    </>
  );
}

// Version source — git (repo/ref/subdir) or url (artifact), + optional hash.
function VersionFields({ meta, set, repoOk }) {
  return (
    <div style={{ display: 'grid', gap: 14, paddingTop: 4, borderTop: '1px solid var(--border-1)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <Field label="Version" hint="Semver — major.minor.patch.">
          <input value={meta.version} onChange={(e) => set('version', e.target.value)} placeholder="1.0.0" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
        </Field>
        <Field label="Source type">
          <select value={meta.type} onChange={(e) => set('type', e.target.value)} style={inputStyle()}>
            <option value="git">git — clone a repo</option>
            <option value="url">url — hosted artifact</option>
          </select>
        </Field>
      </div>
      {meta.type === 'git' ? (
        <>
          <Field label="Source repo" hint="The git repo the collection lives in.">
            <input value={meta.repo} onChange={(e) => set('repo', e.target.value)} placeholder="https://github.com/owner/repo"
              style={inputStyle({ fontFamily: 'var(--font-mono)', borderColor: meta.repo && !repoOk ? 'var(--danger)' : 'var(--border-1)' })} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Subdir" hint="Path within the repo (optional).">
              <input value={meta.subdir} onChange={(e) => set('subdir', e.target.value)} placeholder="stripe-api" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
            </Field>
            <Field label="Ref" hint="Tag/branch/commit (optional).">
              <input value={meta.ref} onChange={(e) => set('ref', e.target.value)} placeholder="stripe-api@1.0.0" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
            </Field>
          </div>
        </>
      ) : (
        <Field label="Artifact URL" hint="Direct download of the opencollection.yml (any host).">
          <input value={meta.url} onChange={(e) => set('url', e.target.value)} placeholder="https://cdn.example.com/stripe/stripe-api/1.0.0/opencollection.yml" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
        </Field>
      )}
      <Field label="Hash" hint="Optional SHA-256 of the artifact (sha256-…). Verified on install.">
        <input value={meta.hash} onChange={(e) => set('hash', e.target.value)} placeholder="sha256-…" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
      </Field>
    </div>
  );
}

function ErrorNote({ children }) {
  return (
    <div style={{ fontSize: 12, color: 'var(--danger)', background: 'var(--danger-bg, rgba(220,50,50,0.08))', border: '1px solid var(--border-1)', borderRadius: 6, padding: '8px 10px' }}>
      {children}
    </div>
  );
}

function PublishStepper({ steps, current }) {
  return (
    <div style={{ display: 'flex', padding: '12px 22px 0', gap: 6 }}>
      {steps.map((s, i) => {
        const n = i + 1;
        const done = current > n;
        const active = current === n;
        return (
          <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, flexShrink: 0,
              background: done ? 'var(--success)' : active ? 'var(--brand)' : 'var(--bg-surface-0)',
              color: done || active ? '#fff' : 'var(--fg-subtext-1)',
            }}>{done ? '✓' : n}</div>
            <span style={{ fontSize: 12, color: active ? 'var(--fg-base)' : 'var(--fg-subtext-1)', fontWeight: active ? 500 : 400 }}>{s}</span>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: done ? 'var(--success)' : 'var(--border-1)' }} />}
          </div>
        );
      })}
    </div>
  );
}

function CopyBlock({ label, text, hint, mono }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }).catch(() => {});
  };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>{label}</span>
        <button onClick={copy} style={{
          border: '1px solid var(--border-1)', background: 'var(--bg-base)', borderRadius: 5,
          padding: '3px 9px', cursor: 'pointer', fontSize: 11.5, color: 'var(--fg-subtext-1)',
          fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          {copied ? <Icons.Check size={12} /> : <Icons.Command size={12} />}{copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{
        margin: 0, padding: '10px 12px', background: 'var(--bg-crust)', border: '1px solid var(--border-1)',
        borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: mono ? 11.5 : 12, color: 'var(--fg-base)',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'auto', maxHeight: mono ? 260 : 'none', lineHeight: 1.5,
      }}>{text}</pre>
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-subtext-1)', marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

export default PublishCollectionModal;
