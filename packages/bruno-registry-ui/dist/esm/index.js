import React, { useRef, useState, useEffect } from 'react';

// Shared icon library — Tabler-style icons (stroke 1.75, 16px default).
// Pure React + inline SVG; no dependencies. Portable to bruno-app as-is.
var Ic = _ref => {
  var {
    size = 16,
    children,
    style
  } = _ref;
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style
  }, children);
};
var Icons = {
  Search: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 21l-6 -6"
  })),
  Download: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 11l5 5l5 -5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 4l0 12"
  })),
  Upload: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 9l5 -5l5 5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 4l0 12"
  })),
  Star: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
  })),
  StarF: p => /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: (p === null || p === void 0 ? void 0 : p.size) || 16,
    height: (p === null || p === void 0 ? void 0 : p.size) || 16,
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
  })),
  Check: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5l10 -10"
  })),
  CheckShield: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 19l2 2l4 -4"
  })),
  Shield: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 12l2 2l4 -4"
  })),
  Clock: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2"
  })),
  Package: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12l8 -4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12l0 9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12l-8 -4.5"
  })),
  Fork: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "6",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "18",
    r: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2v-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12l0 4"
  })),
  Rss: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M5 5a14 14 0 0 1 14 14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 11a8 8 0 0 1 8 8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "18",
    r: "2"
  })),
  Chevron: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6l6 -6"
  })),
  ChevRight: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6l-6 6"
  })),
  Plus: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 5l0 14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 12l14 0"
  })),
  X: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M18 6l-12 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12"
  })),
  Book: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 6l0 13"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 6l0 13"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 6l0 13"
  })),
  GitBranch: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "18",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "6",
    r: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 8v8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 8v2a4 4 0 0 1 -4 4h-6"
  })),
  GitCommit: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 12h6"
  })),
  Folder: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"
  })),
  Lock: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "11",
    width: "14",
    height: "10",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11v-4a4 4 0 0 1 8 0v4"
  })),
  Globe: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.6 9h16.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.6 15h16.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.5 3a17 17 0 0 0 0 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12.5 3a17 17 0 0 1 0 18"
  })),
  Command: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"
  })),
  Home: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l-2 0l9 -9l9 9l-2 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"
  })),
  Sparkle: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l1.5 4.5l4.5 1.5l-4.5 1.5l-1.5 4.5l-1.5 -4.5l-4.5 -1.5l4.5 -1.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 14l.7 1.8l1.8 .7l-1.8 .7l-.7 1.8l-.7 -1.8l-1.8 -.7l1.8 -.7z"
  })),
  Key: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "15",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.85 12.15l7.15 -7.15"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 8l3 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 11l2 2"
  })),
  Server: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "8",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "12",
    width: "18",
    height: "8",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 8l.01 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 16l.01 0"
  })),
  Message: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M8 9h8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 13h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z"
  })),
  Chart: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 19l16 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 15l4 -6l4 2l4 -5l4 4"
  })),
  Box: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12l8 -4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12l0 9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12l-8 -4.5"
  })),
  Card: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 10l18 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 15l2 0"
  })),
  Layout: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "6",
    height: "16",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "4",
    width: "6",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "6",
    height: "6",
    rx: "1"
  })),
  Filter: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227"
  })),
  ArrowUp: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 5l0 14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 11l-6 -6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 11l6 -6"
  })),
  External: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 13l9 -9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 4h5v5"
  })),
  Github: p => /*#__PURE__*/React.createElement("svg", {
    width: (p === null || p === void 0 ? void 0 : p.size) || 16,
    height: (p === null || p === void 0 ? void 0 : p.size) || 16,
    viewBox: "0 0 16 16",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
  })),
  ChevDown: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6l6 -6"
  })),
  More: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "12",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "12",
    r: "1"
  })),
  Settings: p => /*#__PURE__*/React.createElement(Ic, p, /*#__PURE__*/React.createElement("path", {
    d: "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }))
};

function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

// --- Number formatter ---
var fmtN = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n);

// --- Animated count-up ---------------------------------------------------
// Tweens the displayed number toward `target` whenever it changes, so a count
// that the host nudges upward visibly ticks rather than jumping. Host-agnostic:
// the component only animates the value it's given; the host decides when (and
// how fast) the number grows.
function useCountUp(target) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 650;
  var [val, setVal] = useState(target);
  var fromRef = useRef(target);
  var rafRef = useRef(0);
  useEffect(() => {
    var from = fromRef.current;
    var to = target;
    if (from === to) return undefined;
    var start = null;
    var step = now => {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / ms);
      var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(step);else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, ms]);
  return val;
}

// Live install/download stat. Renders an animated, comma-grouped number that
// ticks when `value` rises, with a brief green "+N" flash on each increase.
function DownloadStat(_ref) {
  var {
    value = 0,
    label = 'installs',
    size = 'lg',
    icon = true
  } = _ref;
  var shown = useCountUp(value);
  var prevRef = useRef(value);
  var [delta, setDelta] = useState(0);
  useEffect(() => {
    var d = value - prevRef.current;
    prevRef.current = value;
    if (d > 0) {
      setDelta(d);
      var id = setTimeout(() => setDelta(0), 1100);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [value]);
  var big = size === 'lg';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      position: 'relative'
    }
  }, icon && /*#__PURE__*/React.createElement(Icons.Download, {
    size: big ? 15 : 13,
    style: {
      color: 'var(--fg-subtext-1)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: big ? 15 : 13,
      color: 'var(--fg-base)'
    }
  }, shown.toLocaleString()), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: big ? 12.5 : 11.5,
      color: 'var(--fg-subtext-1)'
    }
  }, label), delta > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '100%',
      marginLeft: 8,
      whiteSpace: 'nowrap',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--success)',
      animation: 'oc-flash-up 1.1s ease-out forwards',
      pointerEvents: 'none'
    }
  }, "+", delta.toLocaleString()), /*#__PURE__*/React.createElement("style", null, "@keyframes oc-flash-up { 0% { opacity: 0; transform: translateY(4px); } 25% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-6px); } }"));
}

// Tiny inline sparkline from an array of numbers (e.g. installs/day).
function Sparkline(_ref2) {
  var {
    points = [],
    width = 180,
    height = 36,
    stroke = 'var(--brand)'
  } = _ref2;
  if (!points.length) return null;
  var max = Math.max(...points, 1);
  var min = Math.min(...points);
  var span = Math.max(max - min, 1);
  var coords = points.map((p, i) => {
    var x = i / Math.max(points.length - 1, 1) * width;
    var y = height - (p - min) / span * (height - 4) - 2;
    return "".concat(x.toFixed(1), ",").concat(y.toFixed(1));
  });
  var line = 'M ' + coords.join(' L ');
  return /*#__PURE__*/React.createElement("svg", {
    width: width,
    height: height,
    style: {
      display: 'block',
      marginTop: 6
    },
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("path", {
    d: "".concat(line, " L ").concat(width, ",").concat(height, " L 0,").concat(height, " Z"),
    fill: "var(--brand-soft)",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: stroke,
    strokeWidth: "1.5"
  }));
}

// --- Badges ---
function VerifiedBadge(_ref3) {
  var {
    size = 14,
    title = 'Verified publisher'
  } = _ref3;
  return /*#__PURE__*/React.createElement("span", {
    title: title,
    style: {
      display: 'inline-flex',
      color: 'var(--hue-blue)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 1l2.39 2.16 3.22 -.27 .57 3.18 2.93 1.36 -1.3 2.96 1.3 2.96 -2.93 1.36 -.57 3.18 -3.22 -.27 -2.39 2.16 -2.39 -2.16 -3.22 .27 -.57 -3.18 -2.93 -1.36 1.3 -2.96 -1.3 -2.96 2.93 -1.36 .57 -3.18 3.22 .27z M9 12l2 2 4-4",
    stroke: "#fff",
    strokeWidth: "1.1",
    fill: "currentColor"
  })));
}
function OfficialPill() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--hue-blue)',
      background: 'hsla(214, 55%, 45%, 0.10)',
      padding: '2px 6px',
      borderRadius: 4,
      whiteSpace: 'nowrap'
    }
  }, "Official");
}
function CommunityPill() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--fg-subtext-1)',
      background: 'var(--bg-surface-0)',
      padding: '2px 6px',
      borderRadius: 4
    }
  }, "Community");
}
function Pill(_ref4) {
  var {
    children,
    tone = 'neutral'
  } = _ref4;
  var tones = {
    neutral: {
      bg: 'var(--bg-surface-0)',
      fg: 'var(--fg-subtext-1)'
    },
    muted: {
      bg: 'rgba(66, 133, 244, 0.12)',
      fg: '#3b6fc9'
    },
    brand: {
      bg: 'var(--brand-soft)',
      fg: 'var(--brand-text)'
    },
    success: {
      bg: 'var(--success-bg)',
      fg: 'var(--success)'
    },
    info: {
      bg: 'var(--info-bg)',
      fg: 'var(--info)'
    },
    warn: {
      bg: 'var(--warning-bg)',
      fg: 'var(--warning)'
    }
  };
  var t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: t.fg,
      background: t.bg,
      padding: '2px 8px',
      borderRadius: 10,
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, children);
}

// --- Buttons ---
function Btn(_ref5) {
  var {
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon,
    style,
    disabled,
    full
  } = _ref5;
  var sizes = {
    sm: {
      pad: '5px 10px',
      fs: 12
    },
    md: {
      pad: '7px 14px',
      fs: 13
    },
    lg: {
      pad: '9px 18px',
      fs: 13
    }
  };
  var variants = {
    primary: {
      bg: 'var(--brand)',
      fg: '#fff',
      bd: 'var(--brand)'
    },
    secondary: {
      bg: '#fff',
      fg: 'var(--fg-base)',
      bd: 'var(--border-1)'
    },
    ghost: {
      bg: 'transparent',
      fg: 'var(--fg-base)',
      bd: 'transparent'
    },
    soft: {
      bg: 'var(--brand-soft)',
      fg: 'var(--brand-text)',
      bd: 'transparent'
    },
    danger: {
      bg: '#fff',
      fg: 'var(--danger)',
      bd: 'var(--border-1)'
    }
  };
  var s = sizes[size],
    v = variants[variant];
  var [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: _objectSpread2({
      padding: s.pad,
      fontSize: s.fs,
      fontWeight: 500,
      background: disabled ? 'var(--bg-surface-0)' : hover && variant === 'primary' ? 'var(--brand-strong)' : hover && variant !== 'primary' ? 'var(--bg-mantle)' : v.bg,
      color: disabled ? 'var(--fg-subtext-0)' : v.fg,
      border: "1px solid ".concat(hover && variant === 'secondary' ? 'var(--border-2)' : v.bd),
      borderRadius: 5,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      whiteSpace: 'nowrap',
      width: full ? '100%' : undefined,
      justifyContent: 'center',
      transition: 'background 0.12s, border-color 0.12s',
      fontFamily: 'inherit'
    }, style)
  }, icon, children);
}

// --- Modal shell (ported from the design; used by the publish flow) ---------
function Modal(_ref6) {
  var {
    children,
    onClose,
    width = 520
  } = _ref6;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.35)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '94vw',
      maxHeight: '92vh',
      background: '#fff',
      borderRadius: 8,
      boxShadow: 'var(--shadow-lg)',
      overflow: 'auto',
      animation: 'oc-modal-in 0.15s ease'
    }
  }, children), /*#__PURE__*/React.createElement("style", null, "@keyframes oc-modal-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }"));
}
function ModalHeader(_ref7) {
  var {
    title,
    sub,
    onClose
  } = _ref7;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-1)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 4
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--fg-subtext-1)'
    }
  }, sub)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'transparent',
      border: 0,
      color: 'var(--fg-subtext-1)',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icons.X, {
    size: 16
  })));
}
function ModalFooter(_ref8) {
  var {
    children
  } = _ref8;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px',
      borderTop: '1px solid var(--border-1)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8
    }
  }, children);
}
function inputStyle(extra) {
  return _objectSpread2({
    padding: '7px 10px',
    fontSize: 13,
    border: '1px solid var(--border-1)',
    borderRadius: 4,
    background: '#fff',
    color: 'var(--fg-base)',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit'
  }, extra);
}
function Field(_ref9) {
  var {
    label,
    children,
    hint
  } = _ref9;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: 'var(--fg-subtext-1)'
    }
  }, label), children, hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--fg-subtext-1)'
    }
  }, hint));
}

// --- Hoverable row helper ---
function Row(_ref0) {
  var {
    children,
    onClick,
    style,
    hoverBg = 'var(--bg-mantle)'
  } = _ref0;
  var [h, setH] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: _objectSpread2({
      background: h ? hoverBg : 'transparent',
      cursor: onClick ? 'pointer' : 'default'
    }, style)
  }, children);
}

// --- Collection card (used across Discover / Search) ---
function CollectionCard(_ref1) {
  var {
    c,
    onOpen,
    compact
  } = _ref1;
  var [h, setH] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen && onOpen(c),
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      border: "1px solid ".concat(h ? 'var(--border-2)' : 'var(--border-1)'),
      borderRadius: 8,
      background: '#fff',
      padding: compact ? 14 : 16,
      cursor: 'pointer',
      transition: 'border-color 0.12s, transform 0.12s',
      transform: h ? 'translateY(-1px)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? 8 : 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 6,
      background: c.color || 'var(--bg-surface-0)',
      color: c.color ? '#fff' : 'var(--fg-subtext-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 14,
      flexShrink: 0,
      fontFamily: 'var(--font-mono)'
    }
  }, c.ns[0].toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      marginBottom: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, c.title), c.verified && /*#__PURE__*/React.createElement(VerifiedBadge, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--fg-subtext-1)',
      fontFamily: 'var(--font-mono)'
    }
  }, c.ns, "/", c.name)), c.official && /*#__PURE__*/React.createElement(OfficialPill, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--fg-subtext-2)',
      lineHeight: 1.5,
      textWrap: 'pretty'
    }
  }, c.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 'auto'
    }
  }, (c.langs || []).map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      fontSize: 10.5,
      color: 'var(--fg-subtext-1)',
      background: 'var(--bg-surface-0)',
      padding: '2px 7px',
      borderRadius: 4,
      fontFamily: 'var(--font-mono)'
    }
  }, l)), c.installs != null && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 11,
      color: 'var(--fg-subtext-1)'
    }
  }, /*#__PURE__*/React.createElement(Icons.Download, {
    size: 11
  }), " ", fmtN(c.installs))));
}

// Semver precedence — the SINGLE implementation. Core (major.minor.patch)
// compares numerically; a prerelease (e.g. 1.0.0-beta) ranks BELOW its release;
// prerelease identifiers compare dot-wise (numeric vs string). Returns >0 if a is
// newer than b. Shared by the server (rebuild + API) and the app (registry-ui)
// so version resolution can't drift between them.


function cmpVersion(a, b) {
  const parse = (v) => {
    const core = String(v == null ? '' : v).trim().replace(/^v/, '').split('+')[0];
    const [main, pre] = core.split('-');
    const nums = main.split('.').map((n) => (/^\d+$/.test(n) ? Number(n) : 0));
    while (nums.length < 3) nums.push(0);
    return { nums, pre: pre || null };
  };
  const pa = parse(a), pb = parse(b);
  for (let i = 0; i < 3; i++) if (pa.nums[i] !== pb.nums[i]) return pa.nums[i] - pb.nums[i];
  if (!pa.pre && !pb.pre) return 0;
  if (!pa.pre) return 1; // release outranks prerelease
  if (!pb.pre) return -1;
  const ai = pa.pre.split('.'), bi = pb.pre.split('.');
  for (let i = 0; i < Math.max(ai.length, bi.length); i++) {
    const x = ai[i], y = bi[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const xn = /^\d+$/.test(x), yn = /^\d+$/.test(y);
    if (xn && yn) { if (Number(x) !== Number(y)) return Number(x) - Number(y); }
    else if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

// The category catalog — id -> display label + icon name. The icons themselves
// render in the UI; this just supplies the label/icon id. Shared so the server's
// facet/discover output and the app's client-side derivation agree on the set.
const CATEGORIES$1 = {
  payments:     { label: 'Payments',         icon: 'card' },
  ai:           { label: 'AI & ML',          icon: 'sparkle' },
  auth:         { label: 'Auth & Identity',  icon: 'key' },
  devops:       { label: 'DevOps & Infra',   icon: 'server' },
  comms:        { label: 'Communications',   icon: 'message' },
  data:         { label: 'Data & Analytics', icon: 'chart' },
  storage:      { label: 'Storage & CDN',    icon: 'box' },
  productivity: { label: 'Productivity',     icon: 'layout' }
};

// The app historically referred to this map as CATEGORY_META — same data.
const CATEGORY_META = CATEGORIES$1;

var PUBLIC_FEATURED = [{
  ns: 'stripe',
  name: 'stripe-api',
  title: 'Stripe API',
  tagline: 'Official Stripe REST API collection — payments, customers, webhooks.',
  category: 'payments',
  verified: true,
  official: true,
  langs: ['REST', 'Webhooks'],
  color: '#635bff'
}, {
  ns: 'github',
  name: 'rest-api',
  title: 'GitHub REST API',
  tagline: 'Full GitHub REST API v2022-11-28, 600+ requests with examples.',
  category: 'devops',
  verified: true,
  official: true,
  langs: ['REST', 'GraphQL'],
  color: '#24292e'
}, {
  ns: 'openai',
  name: 'openai-api',
  title: 'OpenAI API',
  tagline: 'Chat, embeddings, audio, images — the complete OpenAI API surface.',
  category: 'ai',
  verified: true,
  official: true,
  langs: ['REST', 'Streaming'],
  color: '#10a37f'
}];
var PUBLIC_TRENDING = [{
  ns: 'anthropic',
  name: 'claude-api',
  title: 'Claude Messages API',
  tagline: 'Anthropic Messages API with tool use and prompt caching.',
  category: 'ai',
  verified: true,
  official: true,
  langs: ['REST', 'Streaming'],
  color: '#d97757'
}];
var PUBLIC_CATEGORIES = [{
  id: 'payments',
  label: 'Payments',
  icon: 'card',
  count: 1
}, {
  id: 'ai',
  label: 'AI & ML',
  icon: 'sparkle',
  count: 2
}, {
  id: 'devops',
  label: 'DevOps & Infra',
  icon: 'server',
  count: 1
}];

// Registry → data map, keyed by host. The default public registry is opencollection.dev.
var REGISTRY_DATA = {
  'opencollection.dev': {
    featured: PUBLIC_FEATURED,
    trending: PUBLIC_TRENDING,
    categories: PUBLIC_CATEGORIES,
    totalCollections: 4,
    publishers: 4
  }
};
var DEFAULT_REGISTRY = {
  id: 'oc-public',
  name: 'OpenCollection',
  host: 'opencollection.dev',
  kind: 'public'
};
function getRegistryData(registry) {
  if (!registry) return REGISTRY_DATA['opencollection.dev'];
  return REGISTRY_DATA[registry.host] || REGISTRY_DATA['opencollection.dev'];
}

// --- Live, git-backed index -------------------------------------------------
// The real registry is a git repo of one-file-per-collection entries; CI rolls
// them into a single index.json. Consumers fetch that file and search it
// client-side — no server.
//
// Two fetch strategies, one per host:
//
//  • Website (this module's fetchRegistryIndex) reads via the GitHub *contents
//    API* (raw media type). The API reflects git immediately (no CDN cache), so
//    a just-merged PR shows up on the next refresh — but it's rate-limited
//    (60 req/hr unauthenticated) and CORS-enabled for the browser.
//    Override with VITE_REGISTRY_INDEX_URL.
//
//  • Desktop app fetches REGISTRY_INDEX_RAW_URL (raw.githubusercontent.com) from
//    the Electron MAIN process (renderer CSP blocks external connect-src). raw
//    has NO rate limit — ideal for the demo — at the cost of a ~5-min CDN cache.
//    See bruno-electron `renderer:fetch-registry-index` + bruno-app's Registry host.

// raw CDN — no rate limit (hammer refresh freely in dev), ~5-min cache.
var REGISTRY_INDEX_RAW_URL = 'https://raw.githubusercontent.com/gopu-bruno/registry-hybrid/main/index.json';

// GitHub contents API — reflects a just-merged PR immediately, but rate-limited
// to 60 req/hr unauthenticated.
var REGISTRY_INDEX_CONTENTS_API_URL = 'https://api.github.com/repos/gopu-bruno/registry-hybrid/contents/index.json';

// Website index source — toggle by commenting/uncommenting (only ONE active).
// VITE_REGISTRY_INDEX_URL overrides either when set.
//
// TESTING (active): raw CDN — no rate limit while developing.
var REGISTRY_INDEX_URL = import.meta.env && import.meta.env.VITE_REGISTRY_INDEX_URL || REGISTRY_INDEX_RAW_URL;
// DEMOING: GitHub contents API — reflects git immediately. Comment the line
// above and uncomment the line below before a demo.
// export const REGISTRY_INDEX_URL = (import.meta.env && import.meta.env.VITE_REGISTRY_INDEX_URL) || REGISTRY_INDEX_CONTENTS_API_URL;

function fetchRegistryIndex() {
  return _fetchRegistryIndex.apply(this, arguments);
}

// --- Versions & sources -----------------------------------------------------
// A registry entry carries a `versions` array; each version is independently
// sourced (git or url). The index build bakes in `latestVersion`, but we
// recompute defensively here so the UI also works on un-baked / fallback data.
function _fetchRegistryIndex() {
  _fetchRegistryIndex = _asyncToGenerator(function* () {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : REGISTRY_INDEX_URL;
    var isGithubApi = url.startsWith('https://api.github.com/');
    var res = yield fetch(url, {
      cache: 'no-store',
      headers: isGithubApi ? {
        Accept: 'application/vnd.github.raw'
      } : undefined
    });
    if (!res.ok) throw new Error("Registry index fetch failed: ".concat(res.status));
    return res.json();
  });
  return _fetchRegistryIndex.apply(this, arguments);
}
function parseGithubRepo(url) {
  var m = String(url || '').match(/github\.com[/:]([^/]+)\/([^/.\s]+)/i);
  return m ? {
    owner: m[1],
    repo: m[2].replace(/\.git$/, '')
  } : null;
}

// Host-agnostic "looks like a git remote" check — accepts any host (GitHub,
// GitLab, Bitbucket, self-hosted) over http(s)/ssh/git, plus scp-style
// git@host:owner/repo. Used to validate a git source without assuming a host.
function isGitRepoUrl(url) {
  var s = String(url || '').trim();
  if (!s) return false;
  if (/^[^@\s]+@[^:\s]+:.+/.test(s)) return true; // scp-like: git@host:path
  try {
    var u = new URL(s);
    if (!['http:', 'https:', 'ssh:', 'git:'].includes(u.protocol)) return false;
    return !!u.hostname && u.pathname.replace(/^\/+|\/+$/g, '').length > 0;
  } catch (_unused) {
    return false;
  }
}

// A collection's versions, newest-first.
function sortedVersions(collection) {
  return [...(collection && collection.versions || [])].sort((a, b) => cmpVersion(b.version, a.version));
}

// The newest version object (honoring a baked `latestVersion` if present), or null.
function latestVersionEntry(collection) {
  if (!collection) return null;
  if (collection.latestVersion) {
    var hit = (collection.versions || []).find(v => v.version === collection.latestVersion);
    if (hit) return hit;
  }
  return sortedVersions(collection)[0] || null;
}
function latestVersionLabel(collection) {
  return collection && collection.latestVersion || (latestVersionEntry(collection) || {}).version || null;
}

// Resolve a version's git source ({ repo, ref, subdir }) — null for non-git
// versions or when no repo is set.
function gitSourceOf(versionEntry) {
  if (!versionEntry || versionEntry.type !== 'git') return null;
  var s = versionEntry.source || {};
  if (!s.repo) return null;
  return {
    repo: s.repo,
    ref: s.ref || null,
    subdir: s.subdir && s.subdir !== '.' ? s.subdir : null
  };
}

// Build one version object from the publish form.
function buildVersionEntry(meta) {
  var m = meta || {};
  var type = m.type === 'url' ? 'url' : 'git';
  var v = {
    version: (m.version || '').trim() || '1.0.0',
    type
  };
  if (type === 'git') {
    var source = {
      repo: (m.repo || '').trim()
    };
    var ref = (m.ref || '').trim();
    var subdir = (m.subdir || '').trim();
    if (ref) source.ref = ref;
    if (subdir && subdir !== '.') source.subdir = subdir;
    v.source = source;
  } else {
    v.source = {
      url: (m.url || '').trim()
    };
  }
  if ((m.hash || '').trim()) v.hash = m.hash.trim();
  return v;
}

// Build the registry entry (collection/<letter>/<ns>/<name>.json) from collected
// publish metadata. Only what the publisher authors — editorial flags are added
// by maintainers during review, and install counts come from a separate API.
function buildRegistryEntry(meta) {
  var m = meta || {};
  var langs = (m.langs || '').split(',').map(s => s.trim()).filter(Boolean);
  var entry = {
    ns: (m.ns || '').trim(),
    name: (m.name || '').trim(),
    title: (m.title || '').trim(),
    category: m.category || 'devops'
  };
  if ((m.tagline || '').trim()) entry.tagline = m.tagline.trim();
  if (langs.length) entry.langs = langs;
  if ((m.color || '').trim()) entry.color = m.color.trim();
  entry.versions = [buildVersionEntry(m)];
  return entry;
}

// Path of an entry's file within the registry repo (sharded by ns's first char).
function registryEntryPath(entry) {
  var ns = entry && entry.ns || '';
  var name = entry && entry.name || '';
  return "collection/".concat(ns[0] || '_', "/").concat(ns, "/").concat(name, ".json");
}

// Shape the find page expects, derived from a fetched index. Accepts the pure
// catalog ({ collections }) and, defensively, an older { all } index — returns
// null for an empty/missing index so the host can fall back to its snapshot.
function deriveHome(index) {
  var collections = index && (index.collections || index.all) || [];
  if (!collections.length) return null;
  var sorted = [...collections].sort((a, b) => a.title.localeCompare(b.title));
  var featured = sorted.filter(c => c.featured).slice(0, 3);
  var trending = sorted.filter(c => c.trending && !c.featured);
  var counts = {};
  for (var c of collections) counts[c.category] = (counts[c.category] || 0) + 1;
  var categories = Object.entries(CATEGORY_META).map(_ref => {
    var [id, meta] = _ref;
    return {
      id,
      label: meta.label,
      icon: meta.icon,
      count: counts[id] || 0
    };
  }).filter(c => c.count > 0);
  return {
    featured,
    trending,
    categories,
    all: sorted,
    totalCollections: index.totalCollections != null ? index.totalCollections : collections.length,
    publishers: index.publishers != null ? index.publishers : new Set(collections.map(c => c.ns)).size
  };
}

// --- Install counts (separate public API) -----------------------------------
// The registry stores NO usage stats — counts come from a public API keyed by
// ns/name, configured via VITE_REGISTRY_STATS_URL. Returns null when the API
// is unconfigured or any call fails, so the UI hides the stat until it's live.
var REGISTRY_STATS_URL = import.meta.env && import.meta.env.VITE_REGISTRY_STATS_URL || '';
function fetchInstallCount(_x, _x2) {
  return _fetchInstallCount.apply(this, arguments);
}

// --- RegistrySource abstraction (Phase C) -----------------------------------
// One interface, two backings, so the same host code works against either half
// of the hybrid model:
//
//   StaticIndexSource — ONE index.json on any host (raw CDN, GitHub/GitLab/
//     self-hosted). deriveHome + client-side search. Works offline/serverless;
//     no counts, no real facets. This IS the deriveHome path, not thrown away.
//
//   ApiSource — the server's projection: /discover (real trending from measured
//     installs), /search (FTS + facet counts at scale), /collection, /installs
//     (read + advisory report). Honors the advisory contract — getDiscover()
//     falls back to a passed-in static source when the server is unreachable, so
//     browse/install survive a server outage.
//
// Both take an injected IO ({ getJson, postJson }) so the host decides transport:
// the website uses browser fetch; the desktop app routes through the Electron
// main process (renderer CSP blocks external fetch). Methods:
//   getDiscover()                      -> { featured, trending, categories, totalCollections, publishers, monthlyInstalls? }
//   search(query, filters)             -> { results, total, facets, page, perPage }
//   getCollection(ns, name)            -> a single record (or null)
//   getInstallCount(ns, name)          -> number | null
//   reportInstall(ns, name, source)    -> void (advisory; never throws to caller)
function _fetchInstallCount() {
  _fetchInstallCount = _asyncToGenerator(function* (ns, name) {
    if (!REGISTRY_STATS_URL || !ns || !name) return null;
    try {
      var res = yield fetch("".concat(REGISTRY_STATS_URL.replace(/\/$/, ''), "/installs/").concat(ns, "/").concat(name), {
        cache: 'no-store'
      });
      if (!res.ok) return null;
      var data = yield res.json();
      if (typeof data.installs === 'number') return data.installs;
      if (typeof data.count === 'number') return data.count;
      return null;
    } catch (_unused5) {
      return null; // API down / unreachable — caller hides the stat
    }
  });
  return _fetchInstallCount.apply(this, arguments);
}
var browserIo = {
  getJson: (url, headers) => fetch(url, {
    cache: 'no-store',
    headers
  }).then(r => {
    if (!r.ok) throw new Error("GET ".concat(url, " -> ").concat(r.status));
    return r.json();
  }),
  postJson: (url, body) => fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body || {})
  }).then(r => r.ok ? r.json() : null)
};
class StaticIndexSource {
  constructor() {
    var {
      indexUrl,
      statsUrl,
      io
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.indexUrl = indexUrl || REGISTRY_INDEX_URL;
    this.statsUrl = statsUrl || REGISTRY_STATS_URL;
    this.io = io || browserIo;
    this._index = null;
    // Which backing served the last call — always 'static' for this source. The
    // host reads `source.lastMode` to show a "server vs offline index" badge.
    this.lastMode = 'static';
  }
  _load() {
    var _this = this;
    return _asyncToGenerator(function* () {
      if (!_this._index) _this._index = yield _this.io.getJson(_this.indexUrl);
      return _this._index;
    })();
  }
  getDiscover() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      return deriveHome(yield _this2._load());
    })();
  }
  // Client-side search over the cached index — substring match on title/ns/name/
  // tagline, optional category filter, local facet counts.
  search(query) {
    var _arguments = arguments,
      _this3 = this;
    return _asyncToGenerator(function* () {
      var filters = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {};
      var index = yield _this3._load();
      var all = index && (index.collections || index.all) || [];
      var q = String(query || '').trim().toLowerCase();
      var inCategory = c => !filters.category || c.category === filters.category;
      var matches = c => !q || [c.title, c.ns, c.name, c.tagline].some(f => String(f || '').toLowerCase().includes(q));
      var results = all.filter(c => inCategory(c) && matches(c)).sort((a, b) => a.title.localeCompare(b.title));
      var facetSet = all.filter(matches);
      var counts = {};
      for (var c of facetSet) counts[c.category] = (counts[c.category] || 0) + 1;
      var category = Object.entries(counts).map(_ref2 => {
        var [id, count] = _ref2;
        return {
          id,
          label: (CATEGORY_META[id] || {}).label || id,
          count
        };
      }).sort((a, b) => b.count - a.count);
      return {
        results,
        total: results.length,
        page: 1,
        perPage: results.length,
        facets: {
          category
        }
      };
    })();
  }
  getCollection(ns, name) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var index = yield _this4._load();
      var all = index && (index.collections || index.all) || [];
      return all.find(c => c.ns === ns && c.name === name) || null;
    })();
  }
  getInstallCount(ns, name) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      if (!_this5.statsUrl) return null;
      try {
        var data = yield _this5.io.getJson("".concat(_this5.statsUrl.replace(/\/$/, ''), "/installs/").concat(ns, "/").concat(name));
        return typeof data.installs === 'number' ? data.installs : typeof data.count === 'number' ? data.count : null;
      } catch (_unused2) {
        return null;
      }
    })();
  }
  reportInstall() {
    return _asyncToGenerator(function* () {})();
  } /* static index has no write path — advisory no-op */
}
class ApiSource {
  // `fallback` is an optional StaticIndexSource used when the server is
  // unreachable — the advisory contract: browse/install survive an outage.
  constructor() {
    var {
      baseUrl,
      io,
      fallback
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.base = String(baseUrl || '').replace(/\/$/, '');
    this.io = io || browserIo;
    this.fallback = fallback || null;
    // Which backing served the last catalog call: 'api' (the live server),
    // 'static' (fell back to the git-backed index), or 'error' (both failed).
    // The host reads `source.lastMode` after a call to render a status badge —
    // making the advisory fallback visible instead of silent.
    this.lastMode = null;
  }
  // Run a server call; on failure transparently fall back to the static index
  // and record which one actually answered.
  _viaServer(serverCall, fallbackCall) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      try {
        var out = yield serverCall();
        _this6.lastMode = 'api';
        return out;
      } catch (e) {
        if (_this6.fallback) {
          _this6.lastMode = 'static';
          return fallbackCall();
        }
        _this6.lastMode = 'error';
        throw e;
      }
    })();
  }
  getDiscover() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      return _this7._viaServer(() => _this7.io.getJson("".concat(_this7.base, "/v1/discover")), () => _this7.fallback.getDiscover());
    })();
  }
  search(query) {
    var _arguments2 = arguments,
      _this8 = this;
    return _asyncToGenerator(function* () {
      var filters = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : {};
      var params = new URLSearchParams();
      if (query) params.set('q', query);
      if (filters.category) params.set('category', filters.category);
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.page) params.set('page', String(filters.page));
      return _this8._viaServer(() => _this8.io.getJson("".concat(_this8.base, "/v1/search?").concat(params.toString())), () => _this8.fallback.search(query, filters));
    })();
  }
  getCollection(ns, name) {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      try {
        var out = yield _this9.io.getJson("".concat(_this9.base, "/v1/collection/").concat(ns, "/").concat(name));
        _this9.lastMode = 'api';
        return out;
      } catch (e) {
        if (_this9.fallback) {
          _this9.lastMode = 'static';
          return _this9.fallback.getCollection(ns, name);
        }
        _this9.lastMode = 'error';
        return null;
      }
    })();
  }
  getInstallCount(ns, name) {
    var _this0 = this;
    return _asyncToGenerator(function* () {
      try {
        var data = yield _this0.io.getJson("".concat(_this0.base, "/v1/installs/").concat(ns, "/").concat(name));
        return typeof data.installs === 'number' ? data.installs : null;
      } catch (_unused3) {
        return null;
      }
    })();
  }
  reportInstall(ns, name, source) {
    var _this1 = this;
    return _asyncToGenerator(function* () {
      // Advisory, fire-and-forget — failures must never surface to the user or
      // block the install that already succeeded.
      try {
        yield _this1.io.postJson("".concat(_this1.base, "/v1/installs/").concat(ns, "/").concat(name), {
          source
        });
      } catch (_unused4) {/* swallow — advisory */}
    })();
  }
}

// Build a source from a descriptor. `{ kind: 'api', baseUrl }` with an optional
// static fallback, or `{ kind: 'static', indexUrl, statsUrl }`.
function createRegistrySource() {
  var descriptor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var io = arguments.length > 1 ? arguments[1] : undefined;
  if (descriptor.kind === 'api' && descriptor.baseUrl) {
    var fallback = descriptor.indexUrl ? new StaticIndexSource({
      indexUrl: descriptor.indexUrl,
      statsUrl: descriptor.statsUrl,
      io
    }) : null;
    return new ApiSource({
      baseUrl: descriptor.baseUrl,
      io,
      fallback
    });
  }
  return new StaticIndexSource({
    indexUrl: descriptor.indexUrl,
    statsUrl: descriptor.statsUrl,
    io
  });
}

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
function FindAndSharePage(_ref) {
  var {
    onOpenCollection,
    onSearch,
    onPublish,
    registries,
    currentRegistryId,
    onSwitchRegistry,
    onAddRegistry,
    registryData
  } = _ref;
  var [q, setQ] = useState('');
  var onOpen = onOpenCollection || (() => {});
  var search = onSearch || (() => {});
  var submit = e => {
    e && e.preventDefault && e.preventDefault();
    search(q || '');
  };
  var currentReg = (registries || []).find(r => r.id === currentRegistryId) || registries && registries[0] || DEFAULT_REGISTRY;
  var isPrivate = currentReg.kind === 'private-org' || currentReg.kind === 'private';
  // Host supplies live, git-backed data via `registryData`; fall back to the
  // bundled snapshot so the page still renders if the index hasn't loaded yet.
  var data = registryData || getRegistryData(currentReg);
  var featured = data.featured;
  var trending = data.trending;
  var categories = data.categories;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'auto',
      height: '100%',
      background: 'var(--bg-base)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 56px 32px',
      borderBottom: '1px solid var(--border-1)',
      background: isPrivate ? 'var(--bg-mantle)' : '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 960,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
      color: 'var(--fg-subtext-1)',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: isPrivate ? 'muted' : 'brand'
  }, isPrivate ? 'Private · Org-scoped' : 'Public Registry · Beta'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, currentReg.host), currentReg.auth && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-subtext-2)'
    }
  }, "\xB7 ", currentReg.auth.account), onPublish && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "secondary",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icons.Upload, {
      size: 13
    }),
    onClick: onPublish
  }, "Publish"))), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 36,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      marginBottom: 10
    }
  }, isPrivate ? /*#__PURE__*/React.createElement(React.Fragment, null, "Collections inside ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-text)'
    }
  }, currentReg.name), ".") : 'Find and share API collections.'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--fg-subtext-2)',
      maxWidth: 620,
      lineHeight: 1.55,
      textWrap: 'pretty',
      marginBottom: 22
    }
  }, isPrivate ? /*#__PURE__*/React.createElement(React.Fragment, null, "Collections here are visible only to members authenticated through ", currentReg.auth && currentReg.auth.provider, ". Access is managed in your git provider \u2014 not in Bruno.") : /*#__PURE__*/React.createElement(React.Fragment, null, "A public, git-native index of Bruno collections. Discover official APIs, install them into your workspace, and publish your own straight from the app.")), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: 560,
      border: '1px solid var(--border-1)',
      borderRadius: 6,
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0 10px 0 14px',
      color: 'var(--fg-subtext-1)'
    }
  }, /*#__PURE__*/React.createElement(Icons.Search, {
    size: 16
  })), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search ".concat(data.totalCollections.toLocaleString(), " collections").concat(isPrivate ? '' : ' — e.g. stripe, graphql, oauth…'),
    style: {
      flex: 1,
      padding: '11px 0',
      border: 0,
      outline: 0,
      fontSize: 13,
      background: 'transparent',
      color: 'var(--fg-base)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 8px',
      marginRight: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-subtext-1)',
      border: '1px solid var(--border-1)',
      borderRadius: 4
    }
  }, "\u2318K")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 18,
      fontSize: 12,
      color: 'var(--fg-subtext-1)'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--fg-base)',
      fontWeight: 600
    }
  }, data.totalCollections.toLocaleString()), " collections"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--fg-base)',
      fontWeight: 600
    }
  }, data.publishers), " ", isPrivate ? 'internal publishers' : 'publishers'), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--fg-base)',
      fontWeight: 600
    }
  }, categories.length), " categories")))), /*#__PURE__*/React.createElement(Section, {
    title: "Featured",
    right: /*#__PURE__*/React.createElement("a", {
      style: {
        fontSize: 12,
        color: 'var(--link)'
      }
    }, "View all \u2192")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 14
    }
  }, featured.map(c => /*#__PURE__*/React.createElement(CollectionCard, {
    key: c.ns + '/' + c.name,
    c: c,
    onOpen: onOpen
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
      gap: 32,
      padding: '0 56px 48px',
      maxWidth: 1160,
      margin: '0 auto',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Trending this week",
    right: /*#__PURE__*/React.createElement("a", {
      style: {
        fontSize: 12,
        color: 'var(--link)'
      }
    }, "View all \u2192")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-1)',
      borderRadius: 8,
      background: '#fff',
      overflow: 'hidden'
    }
  }, trending.map((c, i) => /*#__PURE__*/React.createElement(TrendingRow, {
    key: c.ns + '/' + c.name,
    c: c,
    rank: i + 1,
    onOpen: onOpen,
    last: i === trending.length - 1
  })))), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Browse by category"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, categories.map(cat => /*#__PURE__*/React.createElement(Row, {
    key: cat.id,
    onClick: () => search('', {
      category: cat.id
    }),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 12px',
      border: '1px solid var(--border-1)',
      borderRadius: 6,
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(CategoryIcon, {
    name: cat.icon
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      flex: 1
    }
  }, cat.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--fg-subtext-1)'
    }
  }, cat.count)))))));
}
function Section(_ref2) {
  var {
    title,
    children,
    right
  } = _ref2;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 56px 8px',
      maxWidth: 1160,
      margin: '0 auto',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: title,
    right: right
  }), children);
}
function SectionHeader(_ref3) {
  var {
    title,
    right
  } = _ref3;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, title), right);
}
function TrendingRow(_ref4) {
  var {
    c,
    rank,
    onOpen,
    last
  } = _ref4;
  return /*#__PURE__*/React.createElement(Row, {
    onClick: () => onOpen(c),
    style: {
      display: 'grid',
      gridTemplateColumns: '28px 36px 1fr auto',
      gap: 12,
      alignItems: 'center',
      padding: '12px 14px',
      borderBottom: last ? 'none' : '1px solid var(--border-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--fg-subtext-0)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500
    }
  }, "#", rank), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 5,
      background: 'var(--bg-surface-0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--fg-subtext-1)',
      fontWeight: 700,
      fontSize: 12,
      fontFamily: 'var(--font-mono)'
    }
  }, c.ns[0].toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, c.title), c.verified && /*#__PURE__*/React.createElement(VerifiedBadge, null), c.official && /*#__PURE__*/React.createElement(OfficialPill, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--fg-subtext-1)',
      marginTop: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, c.tagline)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, (c.langs || []).map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      fontSize: 10.5,
      color: 'var(--fg-subtext-1)',
      background: 'var(--bg-surface-0)',
      padding: '2px 7px',
      borderRadius: 4,
      fontFamily: 'var(--font-mono)'
    }
  }, l))));
}
function CategoryIcon(_ref5) {
  var {
    name
  } = _ref5;
  var map = {
    sparkle: Icons.Sparkle,
    key: Icons.Key,
    server: Icons.Server,
    message: Icons.Message,
    chart: Icons.Chart,
    box: Icons.Box,
    card: Icons.Card,
    layout: Icons.Layout
  };
  var I = map[name] || Icons.Package;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-crust)',
      color: 'var(--fg-subtext-1)',
      borderRadius: 4
    }
  }, /*#__PURE__*/React.createElement(I, {
    size: 13
  }));
}

// Collection detail page — opened when a card/row on the find page is clicked.
//
// Host-agnostic: takes a collection (an index entry) + callbacks. The website
// passes web behavior (copy install command, open repo); bruno-app would pass
// a real install-into-workspace handler. Shows ONLY real data from the index
// entry plus the git source — request contents are fetched from the source repo
// at install time, so we don't fabricate a request list here.
var CATEGORY_LABELS = {
  payments: 'Payments',
  ai: 'AI & ML',
  auth: 'Auth & Identity',
  devops: 'DevOps & Infra',
  comms: 'Communications',
  data: 'Data & Analytics',
  storage: 'Storage & CDN',
  productivity: 'Productivity'
};

// Host-aware "view source" link. Each host has its own tree-path convention, so
// deep-link by host and fall back to the repo root for unknown hosts.
function treeUrl(repo, ref, subdir) {
  var base = String(repo || '').replace(/\.git$/, '').replace(/\/+$/, '');
  if (!base) return null;
  if (!subdir) return base;
  var r = ref || 'HEAD';
  if (/github\.com/i.test(base)) return "".concat(base, "/tree/").concat(r, "/").concat(subdir);
  if (/gitlab\./i.test(base)) return "".concat(base, "/-/tree/").concat(r, "/").concat(subdir);
  if (/bitbucket\.org/i.test(base)) return "".concat(base, "/src/").concat(r, "/").concat(subdir);
  return base; // unknown host — deep path format unknown, link to the repo
}
function CollectionDetailPage(_ref) {
  var {
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
  } = _ref;
  if (!collection) return null;
  var c = collection;
  var slug = "".concat(c.ns, "/").concat(c.name);
  var versions = sortedVersions(c);
  var latest = latestVersionEntry(c);
  var latestLabel = latestVersionLabel(c);
  // Resolve the latest version's source. For git we can link to the repo (at the
  // subdir/ref); for url we link to the artifact directly.
  var git = gitSourceOf(latest);
  var repo = git && git.repo;
  var subdir = git && git.subdir ? git.subdir : '';
  var ref = git && git.ref || 'main';
  var sourceUrl = repo ? treeUrl(repo, ref, subdir) : latest && latest.type === 'url' ? latest.source && latest.source.url : null;
  var sourceLabel = repo ? "".concat(repo.replace(/^https?:\/\//, '')).concat(subdir ? '/' + subdir : '') : latest && latest.type === 'url' ? latest.source && latest.source.url : '';
  var installCmd = installCommand || "bruno install ".concat(slug);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'auto',
      height: '100%',
      background: 'var(--bg-base)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      width: '100%',
      padding: '18px 56px 0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--fg-subtext-1)',
      fontSize: 12.5,
      fontFamily: 'inherit',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1
    }
  }, "\u2190"), " Browse")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--border-1)',
      padding: '16px 56px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      display: 'flex',
      gap: 18,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 12,
      background: c.color || 'var(--bg-surface-0)',
      color: c.color ? '#fff' : 'var(--fg-subtext-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 24,
      flexShrink: 0,
      fontFamily: 'var(--font-mono)'
    }
  }, c.ns[0].toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.01em'
    }
  }, c.title), c.verified && /*#__PURE__*/React.createElement(VerifiedBadge, {
    size: 16
  }), c.official && /*#__PURE__*/React.createElement(OfficialPill, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--fg-subtext-1)',
      fontFamily: 'var(--font-mono)',
      marginTop: 3
    }
  }, slug), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--fg-subtext-2)',
      lineHeight: 1.55,
      marginTop: 12,
      maxWidth: 620,
      textWrap: 'pretty'
    }
  }, c.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 14
    }
  }, (c.langs || []).map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      fontSize: 11,
      color: 'var(--fg-subtext-1)',
      background: 'var(--bg-surface-0)',
      padding: '3px 9px',
      borderRadius: 5,
      fontFamily: 'var(--font-mono)'
    }
  }, l))), (installCount != null || latestLabel || versions.length > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: 16,
      fontSize: 12.5,
      color: 'var(--fg-subtext-1)'
    }
  }, installCount != null && /*#__PURE__*/React.createElement(DownloadStat, {
    value: installCount,
    label: "installs"
  }), latestLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icons.GitBranch, {
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--fg-base)'
    }
  }, "v", latestLabel)), versions.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icons.GitCommit, {
    size: 13
  }), " ", versions.length, " ", versions.length === 1 ? 'version' : 'versions'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icons.GitBranch, {
      size: 14
    }),
    onClick: onInstall
  }, installLabel), sourceUrl && /*#__PURE__*/React.createElement("a", {
    href: sourceUrl,
    target: "_blank",
    rel: "noreferrer",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "secondary",
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icons.Github, {
      size: 14
    }),
    full: true
  }, "View source"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      width: '100%',
      padding: '28px 56px 48px',
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 12
    }
  }, "Install"), /*#__PURE__*/React.createElement(InstallCommand, {
    command: installCmd
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: 'var(--fg-subtext-1)',
      lineHeight: 1.55,
      marginTop: 14
    }
  }, "The collection is fetched from the selected version's source at install time and written into your workspace as native ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, ".bru"), " files. Nothing runs on install."), versions.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 12
    }
  }, "Versions ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-subtext-1)',
      fontWeight: 400
    }
  }, "(", versions.length, ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-1)',
      borderRadius: 8,
      background: '#fff',
      overflow: 'hidden'
    }
  }, versions.map((v, i) => {
    var g = gitSourceOf(v);
    var where = g ? "".concat(g.repo.replace(/^https?:\/\//, '')).concat(g.subdir ? '/' + g.subdir : '').concat(g.ref ? ' @ ' + g.ref : '') : v.source && v.source.url || '';
    return /*#__PURE__*/React.createElement("div", {
      key: v.version,
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: i === versions.length - 1 ? 'none' : '1px solid var(--border-1)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 110
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, "v", v.version, i === 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--success)',
        background: 'var(--success-bg)',
        padding: '1px 5px',
        borderRadius: 4
      }
    }, "Latest")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--fg-subtext-1)',
        marginTop: 3,
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }
    }, v.type)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 12,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-subtext-2)',
        lineHeight: 1.45,
        wordBreak: 'break-all'
      }
    }, where), v.hash && /*#__PURE__*/React.createElement("span", {
      title: v.hash,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11.5,
        color: 'var(--fg-subtext-1)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icons.Check, {
      size: 12
    }), " hash"));
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      padding: '20px',
      border: '1px dashed var(--border-1)',
      borderRadius: 8,
      background: 'var(--bg-mantle)',
      fontSize: 12.5,
      color: 'var(--fg-subtext-1)',
      lineHeight: 1.55
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--fg-base)',
      fontWeight: 600
    }
  }, "No versions listed yet."), " A version is added via a PR to the registry \u2014 a ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "git"), " or ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "url"), " source for the collection's ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "opencollection.yml"), ".")), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 12
    }
  }, "Details"), /*#__PURE__*/React.createElement("dl", {
    style: {
      display: 'grid',
      gap: 12,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement(Detail, {
    label: "Publisher",
    value: c.ns
  }), latestLabel && /*#__PURE__*/React.createElement(Detail, {
    label: "Latest version",
    value: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)'
      }
    }, "v", latestLabel)
  }), c.category && /*#__PURE__*/React.createElement(Detail, {
    label: "Category",
    value: CATEGORY_LABELS[c.category] || c.category
  }), c.langs && c.langs.length > 0 && /*#__PURE__*/React.createElement(Detail, {
    label: "Languages",
    value: c.langs.join(', ')
  }), sourceUrl && /*#__PURE__*/React.createElement(Detail, {
    label: "Source",
    value: /*#__PURE__*/React.createElement("a", {
      href: sourceUrl,
      target: "_blank",
      rel: "noreferrer",
      style: {
        color: 'var(--link)',
        textDecoration: 'none',
        wordBreak: 'break-all'
      }
    }, sourceLabel)
  })))));
}
function Detail(_ref2) {
  var {
    label,
    value
  } = _ref2;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", {
    style: {
      fontSize: 11,
      color: 'var(--fg-subtext-0)',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      marginBottom: 3
    }
  }, label), /*#__PURE__*/React.createElement("dd", {
    style: {
      fontSize: 13,
      color: 'var(--fg-base)',
      margin: 0
    }
  }, value));
}
function InstallCommand(_ref3) {
  var {
    command
  } = _ref3;
  var [copied, setCopied] = useState(false);
  var copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(command).then(() => setCopied(true)).catch(() => {});
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      border: '1px solid var(--border-1)',
      borderRadius: 6,
      background: 'var(--bg-crust)',
      padding: '10px 12px 10px 14px'
    }
  }, /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--fg-base)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-subtext-0)'
    }
  }, "$ "), command), /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    title: "Copy",
    style: {
      border: '1px solid var(--border-1)',
      background: 'var(--bg-base)',
      borderRadius: 5,
      padding: '4px 10px',
      cursor: 'pointer',
      fontSize: 11.5,
      color: 'var(--fg-subtext-1)',
      fontFamily: 'inherit',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, copied ? /*#__PURE__*/React.createElement(Icons.Check, {
    size: 12
  }) : /*#__PURE__*/React.createElement(Icons.Command, {
    size: 12
  }), copied ? 'Copied' : 'Copy'));
}

var CATEGORIES = [['payments', 'Payments'], ['ai', 'AI & ML'], ['auth', 'Auth & Identity'], ['devops', 'DevOps & Infra'], ['comms', 'Communications'], ['data', 'Data & Analytics'], ['storage', 'Storage & CDN'], ['productivity', 'Productivity']];
var slug = s => String(s || '').toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
function PublishCollectionModal(_ref) {
  var {
    onClose,
    onPublish,
    onOpenRegistryPr,
    localCollections,
    onResolveCollectionMeta,
    registryEntries,
    initialMeta
  } = _ref;
  var canPr = typeof onOpenRegistryPr === 'function';
  var hasPicker = canPr && Array.isArray(localCollections) && localCollections.length > 0;
  var [meta, setMeta] = useState(_objectSpread2({
    ns: '',
    name: '',
    title: '',
    tagline: '',
    category: 'payments',
    version: '1.0.0',
    type: 'git',
    repo: '',
    subdir: '',
    ref: '',
    url: '',
    hash: '',
    langs: '',
    pat: ''
  }, initialMeta));
  var [step, setStep] = useState(hasPicker ? 'pick' : 'form');
  var [selected, setSelected] = useState(null);
  var [resolving, setResolving] = useState(false);
  var [result, setResult] = useState(null);
  var [error, setError] = useState(null);
  var set = (k, v) => setMeta(m => _objectSpread2(_objectSpread2({}, m), {}, {
    [k]: v
  }));
  var entry = buildRegistryEntry(meta);
  var version = buildVersionEntry(meta);
  var entryPath = registryEntryPath(entry);
  var entryJson = JSON.stringify(entry, null, 2);
  var repoOk = meta.type !== 'git' || isGitRepoUrl(meta.repo);
  var findListed = (ns, name) => (registryEntries || []).find(e => e && e.ns === ns && e.name === name);
  var alreadyListed = !!findListed(meta.ns.trim(), meta.name.trim());
  var sourceOk = meta.type === 'git' ? repoOk : !!meta.url.trim();
  var versionOk = !!meta.version.trim() && sourceOk;
  var listingOk = alreadyListed || meta.ns.trim() && meta.name.trim() && meta.title.trim();
  var formOk = versionOk && listingOk && (!canPr || meta.pat.trim());
  var chooseCollection = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (c) {
      setSelected(c);
      setMeta(m => _objectSpread2(_objectSpread2({}, m), {}, {
        name: m.name || slug(c.name),
        title: m.title || c.name
      }));
      setStep('form');
      if (!onResolveCollectionMeta) return;
      setResolving(true);
      try {
        var extra = yield onResolveCollectionMeta(c);
        var repo = extra && extra.repo || '';
        var subdir = extra && extra.subdir != null ? extra.subdir : '';
        var owner = extra && extra.owner || '';
        var name = slug(c.name);
        var listed = owner ? findListed(owner, name) : null;
        setMeta(m => _objectSpread2(_objectSpread2({}, m), {}, {
          repo: repo || m.repo,
          subdir: subdir != null ? subdir : m.subdir,
          ns: listed && listed.ns || m.ns || owner,
          name: listed && listed.name || m.name || name,
          title: listed && listed.title || m.title || c.name,
          tagline: listed && listed.tagline || m.tagline,
          category: listed && listed.category || m.category
        }));
      } catch (_unused) {
        /* leave for manual entry */
      } finally {
        setResolving(false);
      }
    });
    return function chooseCollection(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var submit = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* () {
      setError(null);
      if (!formOk) return;
      if (!canPr) {
        // Emit mode (website): just surface the artifacts.
        setStep('done');
        if (onPublish) onPublish({
          entry,
          version,
          entryPath,
          alreadyListed
        });
        return;
      }
      setStep('submitting');
      try {
        var res = yield onOpenRegistryPr({
          entry,
          version,
          alreadyListed,
          meta
        });
        setResult(res || {});
        setStep('done');
      } catch (e) {
        setError(e && e.message || 'Failed to open the registry PR.');
        setStep('form');
      }
    });
    return function submit() {
      return _ref3.apply(this, arguments);
    };
  }();
  var stepperSteps = ['Select', 'Publish'];
  var stepperCurrent = step === 'pick' ? 1 : step === 'form' ? 2 : 0;
  return /*#__PURE__*/React.createElement(Modal, {
    onClose: onClose,
    width: 620
  }, step === 'pick' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModalHeader, {
    title: "Publish a collection",
    sub: "Pick a collection from your workspace to publish to the registry.",
    onClose: onClose
  }), /*#__PURE__*/React.createElement(PublishStepper, {
    steps: stepperSteps,
    current: stepperCurrent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px',
      display: 'grid',
      gap: 8,
      maxHeight: '60vh',
      overflow: 'auto'
    }
  }, localCollections.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.uid || c.name,
    onClick: () => chooseCollection(c),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      textAlign: 'left',
      width: '100%',
      padding: '12px 14px',
      border: '1px solid var(--border-1)',
      borderRadius: 6,
      background: '#fff',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(Icons.Folder, {
    size: 18,
    style: {
      color: 'var(--fg-subtext-1)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      display: 'block'
    }
  }, c.name), c.pathname && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--fg-subtext-1)',
      fontFamily: 'var(--font-mono)',
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, c.pathname)), /*#__PURE__*/React.createElement(Icons.ChevRight, {
    size: 14,
    style: {
      color: 'var(--fg-subtext-2)',
      flexShrink: 0
    }
  })))), /*#__PURE__*/React.createElement(ModalFooter, null, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"))) : step === 'form' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModalHeader, {
    title: alreadyListed ? 'Add a version' : 'Publish a collection',
    sub: alreadyListed ? 'This collection is listed — opening a PR appends a new version to it.' : 'Opens a PR that lists the collection and its first version on the registry.',
    onClose: onClose
  }), hasPicker && /*#__PURE__*/React.createElement(PublishStepper, {
    steps: stepperSteps,
    current: stepperCurrent
  }), selected && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 22px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      color: 'var(--fg-subtext-1)'
    }
  }, /*#__PURE__*/React.createElement(Icons.Folder, {
    size: 13
  }), " Publishing ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--fg-base)',
      fontWeight: 600
    }
  }, selected.name), alreadyListed ? /*#__PURE__*/React.createElement(Pill, {
    tone: "success"
  }, "Listed") : /*#__PURE__*/React.createElement(Pill, {
    tone: "muted"
  }, "Not listed yet"), hasPicker && /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep('pick'),
    style: {
      marginLeft: 'auto',
      background: 'transparent',
      border: 0,
      color: 'var(--link)',
      cursor: 'pointer',
      fontSize: 12,
      fontFamily: 'inherit'
    }
  }, "Change")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      display: 'grid',
      gap: 14,
      maxHeight: '62vh',
      overflow: 'auto'
    }
  }, resolving && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--fg-subtext-1)',
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icons.GitBranch, {
    size: 12
  }), " Resolving repo & subdir from the collection\u2019s git remote\u2026"), !alreadyListed && /*#__PURE__*/React.createElement(ListingFields, {
    meta: meta,
    set: set
  }), /*#__PURE__*/React.createElement(VersionFields, {
    meta: meta,
    set: set,
    repoOk: repoOk
  }), canPr && /*#__PURE__*/React.createElement(Field, {
    label: "GitHub token",
    hint: "Opens the PR on your behalf. Needs public_repo (or write to the registry). Not stored."
  }, /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: meta.pat,
    onChange: e => set('pat', e.target.value),
    placeholder: "ghp_\u2026",
    autoComplete: "off",
    style: inputStyle({
      fontFamily: 'var(--font-mono)'
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--fg-subtext-1)',
      display: 'flex',
      gap: 7,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icons.GitBranch, {
    size: 13,
    style: {
      flexShrink: 0
    }
  }), " Entry:\xA0", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--fg-base)',
      background: 'var(--bg-crust)',
      padding: '1px 6px',
      borderRadius: 3,
      wordBreak: 'break-all'
    }
  }, entryPath)), error && /*#__PURE__*/React.createElement(ErrorNote, null, error)), /*#__PURE__*/React.createElement(ModalFooter, null, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: submit,
    disabled: !formOk
  }, canPr ? alreadyListed ? 'Open version PR' : 'Open registry PR' : 'Generate entry'))) : step === 'submitting' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModalHeader, {
    title: "Opening PR\u2026",
    sub: entryPath
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '34px 22px',
      textAlign: 'center',
      fontSize: 13,
      color: 'var(--fg-subtext-1)',
      fontFamily: 'var(--font-mono)'
    }
  }, "Creating branch \xB7 ", alreadyListed ? 'appending version' : 'adding entry', " \xB7 opening pull request\u2026")) : canPr ?
  /*#__PURE__*/
  // App "done" — PR opened.
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModalHeader, {
    title: "PR opened",
    sub: entryPath,
    onClose: onClose
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      display: 'grid',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'var(--success-bg)',
      color: 'var(--success)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icons.Check, {
    size: 16
  })), /*#__PURE__*/React.createElement("span", null, alreadyListed ? "Version ".concat(meta.version, " added") : 'Listing', " \u2014 once a maintainer merges, it appears on the find page.")), result && result.prUrl && /*#__PURE__*/React.createElement("a", {
    href: result.prUrl,
    target: "_blank",
    rel: "noreferrer",
    style: {
      color: 'var(--link)',
      fontSize: 12.5,
      wordBreak: 'break-all'
    }
  }, result.prUrl, result.viaFork ? ' (from your fork)' : '')), /*#__PURE__*/React.createElement(ModalFooter, null, /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: onClose
  }, "Close"))) :
  /*#__PURE__*/
  // Emit-mode "done" (website): the entry to add via PR.
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModalHeader, {
    title: "Ready to publish",
    sub: "Add this entry to the registry via a pull request.",
    onClose: onClose
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      display: 'grid',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(CopyBlock, {
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "Registry entry ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--fg-subtext-1)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 400
      }
    }, entryPath)),
    text: entryJson,
    hint: "Add this file (or append the version to the existing file) via a PR to the registry repo.",
    mono: true
  })), /*#__PURE__*/React.createElement(ModalFooter, null, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => setStep('form')
  }, "Back"), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: onClose
  }, "Done"))));
}

// Listing metadata — collected only the first time a collection is published.
function ListingFields(_ref4) {
  var {
    meta,
    set
  } = _ref4;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Publisher (ns)",
    hint: "Your owner/org handle."
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.ns,
    onChange: e => set('ns', e.target.value),
    placeholder: "stripe",
    style: inputStyle({
      fontFamily: 'var(--font-mono)'
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Collection name"
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.name,
    onChange: e => set('name', e.target.value),
    placeholder: "stripe-api",
    style: inputStyle({
      fontFamily: 'var(--font-mono)'
    })
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Display title"
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.title,
    onChange: e => set('title', e.target.value),
    placeholder: "Stripe API",
    style: inputStyle()
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Tagline",
    hint: "One sentence shown in search."
  }, /*#__PURE__*/React.createElement("textarea", {
    value: meta.tagline,
    onChange: e => set('tagline', e.target.value),
    rows: 2,
    placeholder: "Payments, customers and webhooks for the Stripe REST API.",
    style: inputStyle({
      minHeight: 52,
      resize: 'vertical'
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Category"
  }, /*#__PURE__*/React.createElement("select", {
    value: meta.category,
    onChange: e => set('category', e.target.value),
    style: inputStyle()
  }, CATEGORIES.map(_ref5 => {
    var [id, label] = _ref5;
    return /*#__PURE__*/React.createElement("option", {
      key: id,
      value: id
    }, label);
  }))));
}

// Version source — git (repo/ref/subdir) or url (artifact), + optional hash.
function VersionFields(_ref6) {
  var {
    meta,
    set,
    repoOk
  } = _ref6;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 14,
      paddingTop: 4,
      borderTop: '1px solid var(--border-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Version",
    hint: "Semver \u2014 major.minor.patch."
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.version,
    onChange: e => set('version', e.target.value),
    placeholder: "1.0.0",
    style: inputStyle({
      fontFamily: 'var(--font-mono)'
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Source type"
  }, /*#__PURE__*/React.createElement("select", {
    value: meta.type,
    onChange: e => set('type', e.target.value),
    style: inputStyle()
  }, /*#__PURE__*/React.createElement("option", {
    value: "git"
  }, "git \u2014 clone a repo"), /*#__PURE__*/React.createElement("option", {
    value: "url"
  }, "url \u2014 hosted artifact")))), meta.type === 'git' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "Source repo",
    hint: "The git repo the collection lives in."
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.repo,
    onChange: e => set('repo', e.target.value),
    placeholder: "https://github.com/owner/repo",
    style: inputStyle({
      fontFamily: 'var(--font-mono)',
      borderColor: meta.repo && !repoOk ? 'var(--danger)' : 'var(--border-1)'
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Subdir",
    hint: "Path within the repo (optional)."
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.subdir,
    onChange: e => set('subdir', e.target.value),
    placeholder: "stripe-api",
    style: inputStyle({
      fontFamily: 'var(--font-mono)'
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Ref",
    hint: "Tag/branch/commit (optional)."
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.ref,
    onChange: e => set('ref', e.target.value),
    placeholder: "stripe-api@1.0.0",
    style: inputStyle({
      fontFamily: 'var(--font-mono)'
    })
  })))) : /*#__PURE__*/React.createElement(Field, {
    label: "Artifact URL",
    hint: "Direct download of the opencollection.yml (any host)."
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.url,
    onChange: e => set('url', e.target.value),
    placeholder: "https://cdn.example.com/stripe/stripe-api/1.0.0/opencollection.yml",
    style: inputStyle({
      fontFamily: 'var(--font-mono)'
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Hash",
    hint: "Optional SHA-256 of the artifact (sha256-\u2026). Verified on install."
  }, /*#__PURE__*/React.createElement("input", {
    value: meta.hash,
    onChange: e => set('hash', e.target.value),
    placeholder: "sha256-\u2026",
    style: inputStyle({
      fontFamily: 'var(--font-mono)'
    })
  })));
}
function ErrorNote(_ref7) {
  var {
    children
  } = _ref7;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--danger)',
      background: 'var(--danger-bg, rgba(220,50,50,0.08))',
      border: '1px solid var(--border-1)',
      borderRadius: 6,
      padding: '8px 10px'
    }
  }, children);
}
function PublishStepper(_ref8) {
  var {
    steps,
    current
  } = _ref8;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '12px 22px 0',
      gap: 6
    }
  }, steps.map((s, i) => {
    var n = i + 1;
    var done = current > n;
    var active = current === n;
    return /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 20,
        height: 20,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 600,
        flexShrink: 0,
        background: done ? 'var(--success)' : active ? 'var(--brand)' : 'var(--bg-surface-0)',
        color: done || active ? '#fff' : 'var(--fg-subtext-1)'
      }
    }, done ? '✓' : n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: active ? 'var(--fg-base)' : 'var(--fg-subtext-1)',
        fontWeight: active ? 500 : 400
      }
    }, s), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: done ? 'var(--success)' : 'var(--border-1)'
      }
    }));
  }));
}
function CopyBlock(_ref9) {
  var {
    label,
    text,
    hint,
    mono
  } = _ref9;
  var [copied, setCopied] = useState(false);
  var copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }).catch(() => {});
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    style: {
      border: '1px solid var(--border-1)',
      background: 'var(--bg-base)',
      borderRadius: 5,
      padding: '3px 9px',
      cursor: 'pointer',
      fontSize: 11.5,
      color: 'var(--fg-subtext-1)',
      fontFamily: 'inherit',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, copied ? /*#__PURE__*/React.createElement(Icons.Check, {
    size: 12
  }) : /*#__PURE__*/React.createElement(Icons.Command, {
    size: 12
  }), copied ? 'Copied' : 'Copy')), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: '10px 12px',
      background: 'var(--bg-crust)',
      border: '1px solid var(--border-1)',
      borderRadius: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: mono ? 11.5 : 12,
      color: 'var(--fg-base)',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflow: 'auto',
      maxHeight: mono ? 260 : 'none',
      lineHeight: 1.5
    }
  }, text), hint && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--fg-subtext-1)',
      marginTop: 6
    }
  }, hint));
}

// App-shell sidebar — logo + navigation.
// Host-agnostic: the host passes the active item and an onSelect callback, so
// the same sidebar mounts in the website and (later) inside bruno-app's surface.
// Only "Browse" exists today — it maps to the find/share page we already have.
var NAV_ITEMS = [{
  id: 'browse',
  label: 'Browse',
  icon: Icons.Globe
}];
function Sidebar(_ref) {
  var {
    active = 'browse',
    onSelect,
    onPublish
  } = _ref;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      flexShrink: 0,
      height: '100%',
      borderRight: '1px solid var(--border-1)',
      background: 'var(--bg-mantle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px'
    }
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("nav", {
    style: {
      marginTop: 22,
      display: 'grid',
      gap: 2
    }
  }, NAV_ITEMS.map(it => /*#__PURE__*/React.createElement(NavItem, {
    key: it.id,
    item: it,
    active: active === it.id,
    onClick: () => onSelect && onSelect(it.id)
  }))), onPublish && /*#__PURE__*/React.createElement("button", {
    onClick: onPublish,
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: '8px 10px',
      borderRadius: 6,
      border: '1px solid var(--border-1)',
      cursor: 'pointer',
      background: '#fff',
      color: 'var(--fg-base)',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(Icons.Upload, {
    size: 14
  }), " Publish"));
}
function Logo() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '4px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 7,
      background: 'var(--brand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icons.Package, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'var(--fg-base)'
    }
  }, "OpenCollection"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--fg-subtext-1)',
      fontFamily: 'var(--font-mono)'
    }
  }, "registry")));
}
function NavItem(_ref2) {
  var {
    item,
    active,
    onClick
  } = _ref2;
  var [hover, setHover] = useState(false);
  var I = item.icon;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      width: '100%',
      textAlign: 'left',
      padding: '7px 10px',
      borderRadius: 6,
      border: 0,
      cursor: 'pointer',
      background: active ? 'var(--brand-soft)' : hover ? 'var(--bg-surface-0)' : 'transparent',
      color: active ? 'var(--brand-text)' : 'var(--fg-subtext-2)',
      fontSize: 13,
      fontWeight: active ? 600 : 500,
      fontFamily: 'inherit',
      transition: 'background 0.12s, color 0.12s'
    }
  }, /*#__PURE__*/React.createElement(I, {
    size: 15
  }), " ", item.label);
}

export { ApiSource, Btn, CATEGORY_META, CollectionCard, CollectionDetailPage, CommunityPill, DEFAULT_REGISTRY, DownloadStat, Field, FindAndSharePage, Ic, Icons, Modal, ModalFooter, ModalHeader, OfficialPill, PUBLIC_CATEGORIES, PUBLIC_FEATURED, PUBLIC_TRENDING, Pill, PublishCollectionModal, REGISTRY_DATA, REGISTRY_INDEX_CONTENTS_API_URL, REGISTRY_INDEX_RAW_URL, REGISTRY_INDEX_URL, REGISTRY_STATS_URL, Row, Sidebar, Sparkline, StaticIndexSource, VerifiedBadge, buildRegistryEntry, buildVersionEntry, cmpVersion, createRegistrySource, deriveHome, fetchInstallCount, fetchRegistryIndex, fmtN, getRegistryData, gitSourceOf, inputStyle, isGitRepoUrl, latestVersionEntry, latestVersionLabel, parseGithubRepo, registryEntryPath, sortedVersions };
//# sourceMappingURL=index.js.map
