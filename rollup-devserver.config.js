import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import rollupConfig from './rollup.config.js';

rollupConfig.plugins.concat([
  serve({ open: true, contentBase: 'public/' }),
  livereload(),
]);

export default rollupConfig;
