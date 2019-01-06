import typescript from 'rollup-plugin-typescript2';
import tslint from 'rollup-plugin-tslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy-glob';
import replace from 'rollup-plugin-replace';

const env = JSON.stringify(process.env.NODE_ENV || 'development');

const namedExports = {
  'node_modules/react/index.js': [
    'Children', 'Component', 'PureComponent', 'createElement', 'cloneElement',
    'isValidElement', 'createFactory', 'version', 'createContext',
  ],
  'node_modules/react-dom/index.js': [
    'findDOMNode', 'render', 'unmountComponentAtNode'
  ],
  'node_modules/react-is/index.js': [
    'isValidElementType', 'isElement', 'ForwardRef',
  ],
};

// TODO reintroduce uglify for vendoring, this may warrant having a different
// file for vendor code since TypeScript can minify for us
export default {
  plugins: [
    tslint({
      throwOnError: true,
      configuration: './tslint.json',
      include: [
        'lib/*.ts', 'lib/*.tsx',
        'lib/**/*.ts', 'lib/**/*.tsx',
      ]
    }),
    typescript({ typescript: require('typescript') }),
    replace({ ENV: env, 'process.env.NODE_ENV': env }),
    resolve({
      jsnext: true, browser: true,
      customResolveOptions: { moduleDirectory: 'node_modules' }
    }),
    commonjs({ namedExports }),
    copy([
      { files: 'node_modules/normalize.css/normalize.css', dest: 'public/' }
    ]),
  ],
  input: 'lib/main.tsx',
  output: {
    file: 'public/js/bundle.js',
    format: 'iife',
    sourcemap: 'inline'
  }
};
