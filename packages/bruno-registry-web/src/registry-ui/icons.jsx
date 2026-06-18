// Shared icon library — Tabler-style icons (stroke 1.75, 16px default).
// Pure React + inline SVG; no dependencies. Portable to bruno-app as-is.
import React from 'react';

export const Ic = ({ size = 16, children, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

export const Icons = {
  Search:   (p) => <Ic {...p}><circle cx="10" cy="10" r="7"/><path d="M21 21l-6 -6"/></Ic>,
  Download: (p) => <Ic {...p}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/></Ic>,
  Upload:   (p) => <Ic {...p}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 9l5 -5l5 5"/><path d="M12 4l0 12"/></Ic>,
  Star:     (p) => <Ic {...p}><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></Ic>,
  StarF:    (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p?.size||16} height={p?.size||16} viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg>,
  Check:    (p) => <Ic {...p}><path d="M5 12l5 5l10 -10"/></Ic>,
  CheckShield: (p) => <Ic {...p}><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"/><path d="M15 19l2 2l4 -4"/></Ic>,
  Shield:   (p) => <Ic {...p}><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/><path d="M9 12l2 2l4 -4"/></Ic>,
  Clock:    (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Ic>,
  Package:  (p) => <Ic {...p}><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"/><path d="M12 12l8 -4.5"/><path d="M12 12l0 9"/><path d="M12 12l-8 -4.5"/></Ic>,
  Fork:     (p) => <Ic {...p}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2v-2"/><path d="M12 12l0 4"/></Ic>,
  Rss:      (p) => <Ic {...p}><path d="M5 5a14 14 0 0 1 14 14"/><path d="M5 11a8 8 0 0 1 8 8"/><circle cx="6" cy="18" r="2"/></Ic>,
  Chevron:  (p) => <Ic {...p}><path d="M6 9l6 6l6 -6"/></Ic>,
  ChevRight:(p) => <Ic {...p}><path d="M9 6l6 6l-6 6"/></Ic>,
  Plus:     (p) => <Ic {...p}><path d="M12 5l0 14"/><path d="M5 12l14 0"/></Ic>,
  X:        (p) => <Ic {...p}><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></Ic>,
  Book:     (p) => <Ic {...p}><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6l0 13"/><path d="M12 6l0 13"/><path d="M21 6l0 13"/></Ic>,
  GitBranch:(p) => <Ic {...p}><circle cx="7" cy="6" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="6" r="2"/><path d="M7 8v8"/><path d="M17 8v2a4 4 0 0 1 -4 4h-6"/></Ic>,
  GitCommit:(p) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M3 12h6"/><path d="M15 12h6"/></Ic>,
  Folder:   (p) => <Ic {...p}><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/></Ic>,
  Lock:     (p) => <Ic {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11v-4a4 4 0 0 1 8 0v4"/></Ic>,
  Globe:    (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></Ic>,
  Command:  (p) => <Ic {...p}><path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"/></Ic>,
  Home:     (p) => <Ic {...p}><path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/></Ic>,
  Sparkle:  (p) => <Ic {...p}><path d="M12 3l1.5 4.5l4.5 1.5l-4.5 1.5l-1.5 4.5l-1.5 -4.5l-4.5 -1.5l4.5 -1.5z"/><path d="M18 14l.7 1.8l1.8 .7l-1.8 .7l-.7 1.8l-.7 -1.8l-1.8 -.7l1.8 -.7z"/></Ic>,
  Key:      (p) => <Ic {...p}><circle cx="8" cy="15" r="4"/><path d="M10.85 12.15l7.15 -7.15"/><path d="M18 8l3 3"/><path d="M15 11l2 2"/></Ic>,
  Server:   (p) => <Ic {...p}><rect x="3" y="4" width="18" height="8" rx="2"/><rect x="3" y="12" width="18" height="8" rx="2"/><path d="M7 8l.01 0"/><path d="M7 16l.01 0"/></Ic>,
  Message:  (p) => <Ic {...p}><path d="M8 9h8"/><path d="M8 13h6"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z"/></Ic>,
  Chart:    (p) => <Ic {...p}><path d="M4 19l16 0"/><path d="M4 15l4 -6l4 2l4 -5l4 4"/></Ic>,
  Box:      (p) => <Ic {...p}><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"/><path d="M12 12l8 -4.5"/><path d="M12 12l0 9"/><path d="M12 12l-8 -4.5"/></Ic>,
  Card:     (p) => <Ic {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10l18 0"/><path d="M7 15l2 0"/></Ic>,
  Layout:   (p) => <Ic {...p}><rect x="4" y="4" width="6" height="16" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></Ic>,
  Filter:   (p) => <Ic {...p}><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227"/></Ic>,
  ArrowUp:  (p) => <Ic {...p}><path d="M12 5l0 14"/><path d="M18 11l-6 -6"/><path d="M6 11l6 -6"/></Ic>,
  External: (p) => <Ic {...p}><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/></Ic>,
  Github:   (p) => <svg width={p?.size||16} height={p?.size||16} viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>,
  ChevDown: (p) => <Ic {...p}><path d="M6 9l6 6l6 -6"/></Ic>,
  More:     (p) => <Ic {...p}><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></Ic>,
  Settings: (p) => <Ic {...p}><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"/><circle cx="12" cy="12" r="3"/></Ic>,
};

export default Icons;
