import typescript from 'rollup-plugin-typescript2';
import tslint from 'rollup-plugin-tslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy-glob';
import replace from 'rollup-plugin-replace';
import { readFileSync as readFile } from 'fs';

const env = JSON.stringify(process.env.NODE_ENV || 'development');

const buildConfig = JSON.parse(readFile('./build-config.json'));

const namedExports = {
  'node_modules/react/index.js': [
    'Children', 'Component', 'PureComponent', 'createElement', 'cloneElement',
    'isValidElement', 'createFactory', 'version', 'createContext',
    'useState', 'useEffect', 'useContext', 'useRef', 'useLayoutEffect',
    'useMemo', 'useReducer', 'useCallback',
  ],
  'node_modules/react-dom/index.js': [
    'findDOMNode', 'render', 'unmountComponentAtNode', 'unstable_batchedUpdates',
  ],
  'node_modules/react-is/index.js': [
    'isValidElementType', 'isElement', 'ForwardRef',
  ],
  'node_modules/react-redux/node_modules/react-is/index.js': [
    'isValidElementType', 'isContextConsumer',
  ]
};

const commonPlugins = [
  resolve({ // resolve must be placed before typescript to get the correct resolutions
    mainFields: [ 'module', 'main', 'browser' ],
    customResolveOptions: { moduleDirectory: 'node_modules' }
  }),
  typescript({ typescript: require('typescript'), check: !process.env.ROLLUP_WATCH }),
  replace({
    ENV: env,
    'process.env.NODE_ENV': env,
    'process.env.OPENWEATHER_API_KEY': JSON.stringify(buildConfig.openweatherAPIKey),
  }),
  commonjs({ namedExports }),
]

// TODO reintroduce uglify for vendoring, this may warrant having a different
// file for vendor code since TypeScript can minify for us
export const appBundle = {
  plugins: [
    copy([
      { files: 'node_modules/normalize.css/normalize.css', dest: 'public/' }
    ]),
    tslint({
      throwOnError: true,
      configuration: './tslint.json',
      include: [
        'lib/*.ts', 'lib/*.tsx',
        'lib/**/*.ts', 'lib/**/*.tsx',
      ]
    }),
    ...commonPlugins,
  ],
  input: 'lib/main.tsx',
  watch: {
    include: 'lib/**',
    exclude: 'lib/apiCacheWorker.ts',
    clearScreen: true,
  },
  output: {
    file: 'public/js/bundle.js',
    name: 'ChromeDashboard',
    format: 'iife',
    sourcemap: env === 'development' ? 'inline' : false,
    preferConst: true,
  }
};

export const apiCacheWorkerBundle = {
  plugins: [
    tslint({
      throwOnError: true,
      configuration: './tslint.json',
      include: [ 'lib/apiCacheWorker/*.ts' ],
    }),
    ...commonPlugins,
  ],
  input: 'lib/apiCacheWorker/index.ts',
  watch: {
    input: 'lib/apiCacheWorker.ts',
    clearScreen: true,
  },
  output: {
    file: 'public/apiCacheWorker.js',
    name: 'APICacheWorker',
    format: 'iife',
    sourcemap: env === 'development' ? 'inline' : false,
    preferConst: true,
  }
};

export default [
  appBundle,
  apiCacheWorkerBundle
];
