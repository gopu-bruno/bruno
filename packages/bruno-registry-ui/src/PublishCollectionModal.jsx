// Publish a collection. Two distinct acts the flow keeps separate:
//
//   1. Publish a VERSION (release)  → the user's OWN repo (tag + opencollection.yml
//      asset). Needs only repo + version + bundle. Happens every release.
//   2. LIST on the registry         → a PR adding collections/<ns>/<name>.json to
//      the registry repo. Needs the display metadata. Happens ONCE (first time);
//      later version bumps re-bake from the entry's source, no new PR.
//
// So the listing metadata (title/tagline/category) is collected only when the
// picked collection isn't already in the index. Host-agnostic via callbacks.
//
// Props:
//   onClose()
//   onPublish(result)                          emit mode (website): artifacts generated
//   onPublishRelease(payload) => {releaseUrl,assetUrl}   real release (app)
//   onListCollection(payload) => {prUrl}       open the first-time listing PR (app)
//   localCollections                           [{uid,name,pathname}] to pick (app)
//   onResolveCollectionMeta(c) => {repo,subdir,owner}    prefill from git (app)
//   registryEntries                            index entries, to detect "already listed"
//   initialMeta
import React, { useState } from 'react';
import { Icons } from './icons.jsx';
import { Modal, ModalHeader, ModalFooter, Field, inputStyle, Btn, Pill } from './primitives.jsx';
import { buildRegistryEntry, buildReleaseTag, parseGithubRepo } from './registryData.js';

const CATEGORIES = [
  ['payments', 'Payments'], ['ai', 'AI & ML'], ['auth', 'Auth & Identity'], ['devops', 'DevOps & Infra'],
  ['comms', 'Communications'], ['data', 'Data & Analytics'], ['storage', 'Storage & CDN'], ['productivity', 'Productivity'],
];

const normRepo = (u) => String(u || '').toLowerCase().trim().replace(/\.git$/, '').replace(/\/+$/, '');
const normSub = (s) => String(s || '').replace(/^\.?\/+/, '').replace(/\/+$/, '');

export function PublishCollectionModal({
  onClose, onPublish, onPublishRelease, onListCollection,
  localCollections, onResolveCollectionMeta, registryEntries, initialMeta,
}) {
  const canPublish = typeof onPublishRelease === 'function';
  const canList = typeof onListCollection === 'function';
  const hasPicker = canPublish && Array.isArray(localCollections) && localCollections.length > 0;

  const [meta, setMeta] = useState({
    ns: '', name: '', title: '', tagline: '',
    category: 'payments', version: '1.0.0',
    repo: '', subdir: '', langs: '', pat: '',
    ...initialMeta,
  });
  const [step, setStep] = useState(hasPicker ? 'pick' : 'release');
  const [selected, setSelected] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [result, setResult] = useState(null);     // release result
  const [prResult, setPrResult] = useState(null);  // listing PR result
  const [error, setError] = useState(null);
  const set = (k, v) => setMeta((m) => ({ ...m, [k]: v }));

  const repoOk = !!parseGithubRepo(meta.repo);
  const entry = buildRegistryEntry(meta);
  const tag = buildReleaseTag(entry.source, meta.version);
  const parsed = parseGithubRepo(meta.repo);
  const entryPath = `collections/${entry.ns || '<ns>'}/${entry.name || '<name>'}.json`;
  const entryJson = JSON.stringify(entry, null, 2);
  const ghCmd = `gh release create '${tag}' opencollection.yml --repo ${parsed ? `${parsed.owner}/${parsed.repo}` : '<owner>/<repo>'}`;

  const findListed = (repo, subdir) =>
    (registryEntries || []).find((e) => e && e.source
      && normRepo(e.source.repo) === normRepo(repo)
      && normSub(e.source.subdir) === normSub(subdir));
  const alreadyListed = !!findListed(meta.repo, meta.subdir);

  const slug = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');

  const chooseCollection = async (c) => {
    setSelected(c);
    setMeta((m) => ({ ...m, name: m.name || slug(c.name), title: m.title || c.name }));
    setStep('release');
    if (!onResolveCollectionMeta) return;
    setResolving(true);
    try {
      const extra = await onResolveCollectionMeta(c);
      const repo = (extra && extra.repo) || '';
      const subdir = extra && extra.subdir != null ? extra.subdir : '';
      const listed = repo ? findListed(repo, subdir) : null;
      setMeta((m) => ({
        ...m,
        repo: repo || m.repo,
        subdir: subdir != null ? subdir : m.subdir,
        // If it's already listed, mirror its registry metadata; else prefill ns from the owner.
        ns: (listed && listed.ns) || m.ns || (extra && extra.owner) || '',
        name: (listed && listed.name) || m.name || slug(c.name),
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

  // Step 1 of the real flow: cut the release on the user's own repo.
  const submitRelease = async () => {
    setError(null);
    if (canPublish) {
      if (!(repoOk && meta.version.trim() && meta.pat.trim())) return;
      setStep('publishing');
      try {
        const res = await onPublishRelease({ meta, entry, tag, name: entry.title || tag, body: entry.tagline, collection: selected });
        setResult(res || {});
        setStep(alreadyListed || !canList ? 'done' : 'list');
      } catch (e) {
        setError((e && e.message) || 'Publish failed.');
        setStep('release');
      }
      return;
    }
    // Emit mode (website): just generate the artifacts.
    if (!(meta.ns.trim() && meta.name.trim() && meta.title.trim() && meta.tagline.trim() && repoOk)) return;
    setStep('done');
    if (onPublish) onPublish({ meta, entry, entryPath, tag, ghCmd });
  };

  // Step 2 (first-time only): open the listing PR to the registry.
  const submitList = async () => {
    setError(null);
    if (!(meta.ns.trim() && meta.name.trim() && meta.title.trim() && meta.tagline.trim())) return;
    setStep('listing');
    try {
      const res = await onListCollection({ entry, meta });
      setPrResult(res || {});
      setStep('done');
    } catch (e) {
      setError((e && e.message) || 'Failed to open the listing PR.');
      setStep('list');
    }
  };

  const stepperSteps = alreadyListed ? ['Select', 'Publish'] : ['Select', 'Publish', 'List'];
  const stepperCurrent = step === 'pick' ? 1 : step === 'release' ? 2 : step === 'list' ? 3 : 0;

  return (
    <Modal onClose={onClose} width={620}>
      {step === 'pick' ? (
        <>
          <ModalHeader title="Publish a collection" sub="Pick a collection from your workspace to push to the registry." onClose={onClose} />
          {hasPicker && <PublishStepper steps={stepperSteps} current={stepperCurrent} />}
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
      ) : step === 'release' ? (
        <>
          <ModalHeader
            title={canPublish ? 'Publish a version' : 'Publish a collection'}
            sub={canPublish ? 'Cut a release on your repo — the tag is the version, the asset is the install.' : 'Tell the registry how to list it. We’ll generate the entry + the version tag.'}
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

          {canPublish ? (
            // Real release form — minimal: repo (auto) + version + token.
            <div style={{ padding: '18px 22px', display: 'grid', gap: 14 }}>
              <Field label="Source repo" hint={resolving ? 'Resolving from the collection’s git remote…' : 'The release is cut here — your own repo.'}>
                <input value={meta.repo} onChange={(e) => set('repo', e.target.value)} placeholder={resolving ? 'Resolving…' : 'https://github.com/owner/repo'}
                  style={inputStyle({ fontFamily: 'var(--font-mono)', borderColor: meta.repo && !repoOk ? 'var(--danger)' : 'var(--border-1)' })} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Version" hint="Becomes the release tag.">
                  <input value={meta.version} onChange={(e) => set('version', e.target.value)} placeholder="1.0.0" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
                </Field>
                <Field label="Release tag">
                  <div style={{ ...inputStyle({ background: 'var(--bg-crust)', display: 'flex', alignItems: 'center' }) }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-base)' }}>{tag}</code>
                  </div>
                </Field>
              </div>
              <Field label="GitHub token" hint="Creates the release on your behalf. Needs contents:write. Not stored.">
                <input type="password" value={meta.pat} onChange={(e) => set('pat', e.target.value)} placeholder="ghp_…" autoComplete="off" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
              </Field>
              {!alreadyListed && (
                <div style={{ fontSize: 11.5, color: 'var(--fg-subtext-1)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                  <Icons.Rss size={13} style={{ marginTop: 1, flexShrink: 0 }} />
                  Not on the registry yet — after the release we’ll collect its listing details and open the PR.
                </div>
              )}
              {error && <ErrorNote>{error}</ErrorNote>}
            </div>
          ) : (
            // Emit mode (website): full metadata form, generates artifacts.
            <EmitForm meta={meta} set={set} repoOk={repoOk} tag={tag} error={error} />
          )}

          <ModalFooter>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn variant="primary" onClick={submitRelease}
              disabled={canPublish ? !(repoOk && meta.version.trim() && meta.pat.trim()) : !(meta.ns.trim() && meta.name.trim() && meta.title.trim() && meta.tagline.trim() && repoOk)}>
              {canPublish ? 'Publish version' : 'Generate entry'}
            </Btn>
          </ModalFooter>
        </>
      ) : step === 'publishing' ? (
        <>
          <ModalHeader title="Publishing…" sub={`${tag}`} />
          <div style={{ padding: '34px 22px', textAlign: 'center', fontSize: 13, color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)' }}>
            Creating release · uploading opencollection.yml…
          </div>
        </>
      ) : step === 'list' ? (
        <>
          <ModalHeader title="List on the registry" sub="First-time listing — opens a PR adding your entry so it shows on the find page." onClose={onClose} />
          {hasPicker && <PublishStepper steps={stepperSteps} current={stepperCurrent} />}
          <div style={{ padding: '18px 22px', display: 'grid', gap: 14 }}>
            {result && result.releaseUrl && (
              <div style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icons.Check size={13} /> Release published. Now list it (one time).
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Publisher (ns)">
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
            {error && <ErrorNote>{error}</ErrorNote>}
          </div>
          <ModalFooter>
            <Btn variant="ghost" onClick={() => setStep('done')}>Skip for now</Btn>
            <Btn variant="primary" onClick={submitList} disabled={!(meta.ns.trim() && meta.name.trim() && meta.title.trim() && meta.tagline.trim())}>Open registry PR</Btn>
          </ModalFooter>
        </>
      ) : step === 'listing' ? (
        <>
          <ModalHeader title="Opening PR…" sub={entryPath} />
          <div style={{ padding: '34px 22px', textAlign: 'center', fontSize: 13, color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)' }}>
            Creating branch · adding entry · opening pull request…
          </div>
        </>
      ) : canPublish ? (
        // Real "done" — release succeeded; listing status varies.
        <>
          <ModalHeader title="Published" sub={tag} onClose={onClose} />
          <div style={{ padding: '18px 22px', display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icons.Check size={16} /></span>
              <span>Release published — downloads of <code style={{ fontFamily: 'var(--font-mono)' }}>opencollection.yml</code> now count as installs.</span>
            </div>
            {result && result.releaseUrl && <a href={result.releaseUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--link)', fontSize: 12.5, wordBreak: 'break-all' }}>{result.releaseUrl}</a>}

            <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-1)' }}>
              {alreadyListed ? (
                <div style={{ fontSize: 12.5, color: 'var(--fg-subtext-1)', display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                  <Icons.Check size={14} style={{ color: 'var(--success)', marginTop: 1, flexShrink: 0 }} />
                  Already listed on the registry — its version &amp; install count refresh on the next index rebuild. No PR needed.
                </div>
              ) : prResult && prResult.prUrl ? (
                <div style={{ fontSize: 12.5 }}>
                  <div style={{ marginBottom: 4 }}>
                    Listing PR opened{prResult.viaFork ? ' from your fork' : ''} — once a maintainer merges it, the collection appears on the find page:
                  </div>
                  <a href={prResult.prUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--link)', wordBreak: 'break-all' }}>{prResult.prUrl}</a>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-subtext-1)', marginBottom: 8 }}>
                    Not listed yet — add this entry via a PR to the registry to appear on the find page:
                  </div>
                  <CopyBlock label={<span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, color: 'var(--fg-subtext-1)' }}>{entryPath}</span>} text={entryJson} mono />
                </>
              )}
            </div>
          </div>
          <ModalFooter><Btn variant="primary" onClick={onClose}>Close</Btn></ModalFooter>
        </>
      ) : (
        // Emit-mode "done" (website): the two artifacts to apply manually.
        <>
          <ModalHeader title="Ready to publish" sub="Two artifacts — add the entry to the registry, and cut the release on your repo." onClose={onClose} />
          <div style={{ padding: '18px 22px', display: 'grid', gap: 18 }}>
            <CopyBlock label={<>1 · Registry entry <span style={{ color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)', fontWeight: 400 }}>{entryPath}</span></>} text={entryJson} hint="Add this file via a PR to the collection-registry repo." mono />
            <CopyBlock label={<>2 · Cut the release <Pill tone="brand">v{meta.version}</Pill></>} text={ghCmd} hint="Creates the git tag + opencollection.yml asset GitHub counts as installs." />
          </div>
          <ModalFooter>
            <Btn variant="ghost" onClick={() => setStep('release')}>Back</Btn>
            <Btn variant="primary" onClick={onClose}>Done</Btn>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}

function EmitForm({ meta, set, repoOk, tag, error }) {
  return (
    <div style={{ padding: '18px 22px', display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Publisher (ns)" hint="Your owner/org handle.">
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-1)', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
            <span style={{ padding: '7px 8px 7px 10px', color: 'var(--fg-subtext-1)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>@</span>
            <input value={meta.ns} onChange={(e) => set('ns', e.target.value)} placeholder="stripe" style={inputStyle({ border: 0, fontFamily: 'var(--font-mono)', paddingLeft: 0 })} />
          </div>
        </Field>
        <Field label="Collection name">
          <input value={meta.name} onChange={(e) => set('name', e.target.value)} placeholder="stripe-api" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
        </Field>
      </div>
      <Field label="Display title"><input value={meta.title} onChange={(e) => set('title', e.target.value)} placeholder="Stripe API" style={inputStyle()} /></Field>
      <Field label="Tagline" hint="One sentence shown in search.">
        <textarea value={meta.tagline} onChange={(e) => set('tagline', e.target.value)} rows={2} placeholder="Payments, customers and webhooks for the Stripe REST API." style={inputStyle({ minHeight: 52, resize: 'vertical' })} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Category">
          <select value={meta.category} onChange={(e) => set('category', e.target.value)} style={inputStyle()}>
            {CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </Field>
        <Field label="Version" hint="Becomes the release tag.">
          <input value={meta.version} onChange={(e) => set('version', e.target.value)} placeholder="1.0.0" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
        </Field>
      </div>
      <Field label="Source repo" hint="The GitHub repo the collection lives in.">
        <input value={meta.repo} onChange={(e) => set('repo', e.target.value)} placeholder="https://github.com/owner/repo" style={inputStyle({ fontFamily: 'var(--font-mono)', borderColor: meta.repo && !repoOk ? 'var(--danger)' : 'var(--border-1)' })} />
      </Field>
      <Field label="Subdir" hint="Path within the repo, if not at the root. Sets the tag prefix.">
        <input value={meta.subdir} onChange={(e) => set('subdir', e.target.value)} placeholder="stripe-stripe-api" style={inputStyle({ fontFamily: 'var(--font-mono)' })} />
      </Field>
      <div style={{ fontSize: 11.5, color: 'var(--fg-subtext-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icons.GitBranch size={13} /> Release tag:&nbsp;
        <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-base)', background: 'var(--bg-crust)', padding: '1px 6px', borderRadius: 3 }}>{tag}</code>
      </div>
      {error && <ErrorNote>{error}</ErrorNote>}
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

// Step indicator (design's wizard stepper).
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
