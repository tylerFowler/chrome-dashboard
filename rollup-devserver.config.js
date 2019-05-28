import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import { appBundle, apiCacheWorkerBundle } from './rollup.config.js';

appBundle.plugins.concat([
  serve({
    open: true,
    contentBase: 'public/',
    host: 'localhost',
    port: 8080,
    headers: { 'Access-Control-Allow-Origin': '*' },
  }),
  livereload(),
]);

export default [ appBundle, apiCacheWorkerBundle ];
