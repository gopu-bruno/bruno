import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const extensions = ['.js', '.jsx'];

// React is provided by the host (peer dep) — never bundle it, so hooks bind to
// the host's single React instance (bruno-app = React 19, website = React 18).
const external = ['react', 'react-dom', 'react/jsx-runtime'];

const plugins = [
  nodeResolve({ extensions }),
  babel({
    babelHelpers: 'bundled',
    babelrc: false,
    configFile: false,
    extensions,
    // Classic runtime: every component file does `import React`, so no
    // dependency on react/jsx-runtime is introduced.
    presets: [
      ['@babel/preset-env', { targets: { esmodules: true } }],
      ['@babel/preset-react', { runtime: 'classic' }],
    ],
  }),
];

export default {
  input: 'src/index.js',
  external,
  plugins,
  output: [
    { dir: 'dist/esm', format: 'esm', preserveModules: false, sourcemap: true },
    { dir: 'dist/cjs', format: 'cjs', preserveModules: false, sourcemap: true, exports: 'named' },
  ],
};
