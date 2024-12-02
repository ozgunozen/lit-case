import {legacyPlugin} from '@web/dev-server-legacy';
import {fromRollup} from '@web/dev-server-rollup';
import replace from '@rollup/plugin-replace';

const replacePlugin = fromRollup(replace);

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  static: {
    directory: 'public',
  },
  spa: true,
  plugins: [
    legacyPlugin({
      polyfills: {
        webcomponents: false,
      },
    }),
    replacePlugin({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(mode === 'dev' ? 'development' : 'production'),
    }),
  ],
  appIndex: './index.html',
};