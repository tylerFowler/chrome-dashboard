import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV || 'development';

const namedExports = {
  'node_modules/react/index.js': [
    'Children', 'Component', 'PureComponent', 'createElement', 'cloneElement',
    'isValidElement', 'createFactory', 'version'
  ],
  'node_modules/react-dom/index.js': [
    'findDOMNode', 'render', 'unmountComponentAtNode'
  ]
};

export default {
  input: 'app/index.js',
  plugins: [
    eslint({ throwError: env === 'production', configFile: '.eslintrc' }),
    resolve({ jsnext: true, browser: true }),
    babel({ exclude: 'node_modules/**' }),
    commonjs({ namedExports: namedExports }),
    replace({
      ENV: env,
      'process.env.NODE_ENV': env
    }),
    env === 'production' && uglify()
  ],
  output: {
    file: 'public/js/build.min.js',
    format: 'iife',
    sourcemap: 'inline'
  }
};
