import React, { useState, useRef, useEffect } from 'react';

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
    enumerable: true,
    configurable: true,
    writable: true
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
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
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
    var i = e.call(t, r);
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

// --- Hoverable row helper ---
function Row(_ref6) {
  var {
    children,
    onClick,
    style,
    hoverBg = 'var(--bg-mantle)'
  } = _ref6;
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
function CollectionCard(_ref7) {
  var {
    c,
    onOpen,
    compact
  } = _ref7;
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
  }, l)), c.downloads != null && /*#__PURE__*/React.createElement("span", {
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
  }), " ", fmtN(c.downloads))));
}

// Bundled fallback snapshot — opencollection.dev
// Identity model: GitHub-style namespace (owner/repo); the registry is a thin
// index over real git repos. This is only a pre-load fallback shaped exactly
// like the live index (fetchRegistryIndex); real data replaces it on mount.
// No usage stats are stored — only authored metadata + editorial flags.

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
var REGISTRY_INDEX_RAW_URL = 'https://raw.githubusercontent.com/gopu-bruno/collection-registry/main/index.json';

// GitHub contents API — reflects a just-merged PR immediately, but rate-limited
// to 60 req/hr unauthenticated.
var REGISTRY_INDEX_CONTENTS_API_URL = 'https://api.github.com/repos/gopu-bruno/collection-registry/contents/index.json';

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

// --- Live release stats (GitHub Releases) -----------------------------------
// The index already carries CI-baked usage stats (version/downloads/releases),
// but a collection's detail page re-fetches them straight from GitHub so the
// install count is current. Same model as the build pipeline: a version is a
// git tag, the install count is the sum of asset downloads, and several
// collections in one repo are told apart by a tag prefix.
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
var RELEASE_ASSET_RE = /opencollection.*\.ya?ml$/i;
function parseGithubRepo(url) {
  var m = String(url || '').match(/github\.com[/:]([^/]+)\/([^/.\s]+)/i);
  return m ? {
    owner: m[1],
    repo: m[2].replace(/\.git$/, '')
  } : null;
}
function releaseTagPrefix(collection) {
  var s = collection && collection.source || {};
  if (s.tagPrefix) return s.tagPrefix;
  if (s.subdir && s.subdir !== '.') return "".concat(s.subdir, "@");
  return null; // whole-repo: every release belongs to this collection
}
function stripTagPrefix(tag, prefix) {
  if (prefix && tag.startsWith(prefix)) return tag.slice(prefix.length);
  return String(tag).replace(/^v/, '');
}
function assetDownloads(release) {
  return (release.assets || []).reduce((s, a) => s + (a.download_count || 0), 0);
}
function pickAsset(release) {
  var assets = release.assets || [];
  return assets.find(a => RELEASE_ASSET_RE.test(a.name)) || assets[0] || null;
}

// Reduce raw GitHub releases to one collection's stats (shape matches the index).
function deriveReleaseStats(releases, collection) {
  var prefix = releaseTagPrefix(collection);
  var mine = (releases || []).filter(r => prefix ? (r.tag_name || '').startsWith(prefix) : true);
  var sorted = mine.slice().sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
  var latest = sorted.find(r => !r.prerelease) || sorted[0] || null;
  var latestAsset = latest ? pickAsset(latest) : null;
  return {
    version: latest ? stripTagPrefix(latest.tag_name, prefix) : null,
    downloads: mine.reduce((s, r) => s + assetDownloads(r), 0),
    releaseCount: mine.length,
    latestAssetUrl: latestAsset ? latestAsset.browser_download_url : null,
    releases: sorted.slice(0, 20).map(r => {
      var asset = pickAsset(r);
      return {
        version: stripTagPrefix(r.tag_name, prefix),
        tag: r.tag_name,
        publishedAt: r.published_at,
        downloads: assetDownloads(r),
        prerelease: !!r.prerelease,
        notes: (r.body || '').split('\n').find(l => l.trim()) || '',
        assetUrl: asset ? asset.browser_download_url : null
      };
    })
  };
}

// The browser fetch below is UNAUTHENTICATED (a token can't be shipped to the
// client safely), so it's bound by GitHub's 60 req/hr-per-IP limit. To stay
// well under it we (a) only fetch on the detail page — never per card,
// (b) cache per session with a TTL so revisits are free, and (c) degrade
// silently to the CI-baked index stats on rate-limit/error rather than throw.
// The baked index.json (refreshed hourly by CI) is always the floor.
var RELEASE_TTL_MS = 10 * 60 * 1000; // 10 min
var _releaseMem = new Map(); // slug -> { at, stats }

function readReleaseCache(slug) {
  var m = _releaseMem.get(slug);
  if (m && Date.now() - m.at < RELEASE_TTL_MS) return m.stats;
  try {
    if (typeof sessionStorage !== 'undefined') {
      var raw = sessionStorage.getItem('oc-rel:' + slug);
      if (raw) {
        var o = JSON.parse(raw);
        if (Date.now() - o.at < RELEASE_TTL_MS) return o.stats;
      }
    }
  } catch (_unused) {/* sessionStorage unavailable/full — ignore */}
  return undefined;
}
function writeReleaseCache(slug, stats) {
  var rec = {
    at: Date.now(),
    stats
  };
  _releaseMem.set(slug, rec);
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('oc-rel:' + slug, JSON.stringify(rec));
  } catch (_unused2) {/* ignore quota/availability */}
}

// Fetch a collection's live release stats from GitHub. Returns null when the
// repo can't be parsed OR when the live call fails / is rate-limited (the
// caller then keeps the index-baked stats); zero-stats if the repo has no
// releases. Pass { force: true } to bypass the session cache (e.g. a Refresh).
function fetchCollectionReleases(_x) {
  return _fetchCollectionReleases.apply(this, arguments);
}
function _fetchCollectionReleases() {
  _fetchCollectionReleases = _asyncToGenerator(function* (collection) {
    var {
      force = false
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var parsed = parseGithubRepo(collection && collection.source && collection.source.repo);
    if (!parsed) return null;
    var slug = "".concat(collection.ns, "/").concat(collection.name);
    if (!force) {
      var cached = readReleaseCache(slug);
      if (cached !== undefined) return cached;
    }
    var res;
    try {
      res = yield fetch("https://api.github.com/repos/".concat(parsed.owner, "/").concat(parsed.repo, "/releases?per_page=100"), {
        cache: 'no-store',
        headers: {
          Accept: 'application/vnd.github+json'
        }
      });
    } catch (_unused3) {
      return null; // network error — fall back to baked stats
    }
    if (res.status === 403 || res.status === 429) return null; // rate-limited — degrade silently
    if (res.status === 404) {
      var zero = deriveReleaseStats([], collection);
      writeReleaseCache(slug, zero);
      return zero;
    }
    if (!res.ok) return null;
    var releases = (yield res.json()).filter(r => !r.draft);
    var stats = deriveReleaseStats(releases, collection);
    writeReleaseCache(slug, stats);
    return stats;
  });
  return _fetchCollectionReleases.apply(this, arguments);
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
  }, "\xB7 ", currentReg.auth.account)), /*#__PURE__*/React.createElement("h1", {
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
var fmtDate = iso => {
  if (!iso) return '';
  var d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
function CollectionDetailPage(_ref) {
  var {
    collection,
    onBack,
    onInstall,
    // Host-specific install affordances. The desktop app clones the source repo
    // into the workspace, so it passes a truthful `git clone …` command and a
    // clone-explicit label; the website keeps its own defaults.
    installLabel = 'Add to Bruno',
    installCommand
  } = _ref;
  if (!collection) return null;
  var c = collection;
  var slug = "".concat(c.ns, "/").concat(c.name);
  var source = c.source || {};
  var repo = source.repo;
  // The collection lives in its own subdir of the source repo — link there, not
  // at the repo root, so "View source" shows this collection, not all of them.
  var subdir = source.subdir && source.subdir !== '.' ? source.subdir : '';
  var ref = source.ref || 'main';
  var sourceUrl = repo ? subdir ? "".concat(repo, "/tree/").concat(ref, "/").concat(subdir) : repo : null;
  var sourceLabel = repo ? "".concat(repo.replace(/^https?:\/\//, '')).concat(subdir ? '/' + subdir : '') : '';
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
  }, l))), (c.downloads != null || c.version || c.updated) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: 16,
      fontSize: 12.5,
      color: 'var(--fg-subtext-1)'
    }
  }, c.downloads != null && /*#__PURE__*/React.createElement(DownloadStat, {
    value: c.downloads,
    label: "installs"
  }), c.version && /*#__PURE__*/React.createElement("span", {
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
  }, "v", c.version)), c.releaseCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icons.GitCommit, {
    size: 13
  }), " ", c.releaseCount, " ", c.releaseCount === 1 ? 'release' : 'releases'), c.updated && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icons.Clock, {
    size: 13
  }), " Updated ", c.updated))), /*#__PURE__*/React.createElement("div", {
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
  }, "Requests are fetched from the source repository at install time and written into your workspace as native ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, ".bru"), " files. Nothing runs on install."), c.releases && c.releases.length > 0 ? /*#__PURE__*/React.createElement("div", {
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
  }, "(", c.releaseCount, ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-1)',
      borderRadius: 8,
      background: '#fff',
      overflow: 'hidden'
    }
  }, c.releases.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.tag,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: i === c.releases.length - 1 ? 'none' : '1px solid var(--border-1)'
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
  }, "v", r.version, i === 0 && !r.prerelease && /*#__PURE__*/React.createElement("span", {
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
  }, "Latest"), r.prerelease && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9.5,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: 'var(--fg-subtext-1)',
      background: 'var(--bg-surface-0)',
      padding: '1px 5px',
      borderRadius: 4
    }
  }, "Pre")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--fg-subtext-1)',
      marginTop: 2
    }
  }, fmtDate(r.publishedAt))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      fontSize: 12.5,
      color: 'var(--fg-subtext-2)',
      lineHeight: 1.45,
      textWrap: 'pretty'
    }
  }, r.notes || /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-subtext-0)'
    }
  }, "No release notes")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 12,
      color: 'var(--fg-subtext-1)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icons.Download, {
    size: 12
  }), " ", fmtN(r.downloads)))))) : /*#__PURE__*/React.createElement("div", {
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
  }, "No released versions yet."), " Once a release is published on the source repo (a git tag carrying an ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "opencollection.yml"), " asset), its versions and install counts appear here automatically.")), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("h3", {
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
  }), c.version && /*#__PURE__*/React.createElement(Detail, {
    label: "Latest version",
    value: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)'
      }
    }, "v", c.version)
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
    onSelect
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
  }))));
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

export { Btn, CollectionCard, CollectionDetailPage, CommunityPill, DEFAULT_REGISTRY, DownloadStat, FindAndSharePage, Ic, Icons, OfficialPill, PUBLIC_CATEGORIES, PUBLIC_FEATURED, PUBLIC_TRENDING, Pill, REGISTRY_DATA, REGISTRY_INDEX_CONTENTS_API_URL, REGISTRY_INDEX_RAW_URL, REGISTRY_INDEX_URL, Row, Sidebar, Sparkline, VerifiedBadge, deriveReleaseStats, fetchCollectionReleases, fetchRegistryIndex, fmtN, getRegistryData, parseGithubRepo, releaseTagPrefix };
//# sourceMappingURL=index.js.map
