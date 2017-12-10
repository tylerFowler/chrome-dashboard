const gulp       = require('gulp');
const clean      = require('gulp-clean');
const gulpEslint = require('gulp-eslint');
const livereload = require('gulp-livereload');
const imagemin   = require('gulp-imagemin');
const { exec }   = require('child_process');

/** Rollup-specific imports **/
const { rollup } = require('rollup');
const babel      = require('rollup-plugin-babel');
const eslint     = require('rollup-plugin-eslint');
const uglify     = require('rollup-plugin-uglify');
const replace    = require('rollup-plugin-replace');
const resolve    = require('rollup-plugin-node-resolve');
const commonjs   = require('rollup-plugin-commonjs');

const env = JSON.stringify(process.env.NODE_ENV || 'development');

// we must do this because the React libraries use object properties
// to export things, see this for more information:
// https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
const reactNamedExports = {
  'node_modules/react/index.js': [
    'Children', 'Component', 'PureComponent', 'createElement', 'cloneElement',
    'isValidElement', 'createFactory', 'version'
  ],
  'node_modules/react-dom/index.js': [
    'findDOMNode', 'render', 'unmountComponentAtNode'
  ]
};

// Clean tasks
gulp.task('clean:app', () =>
  gulp.src('public/js/build.min.js', { read: false }).pipe(clean())
);

gulp.task('clean:normalize', () =>
  gulp.src('public/normalize.css', { read: false }).pipe(clean())
);

gulp.task('inject:normalize', [ 'clean:normalize' ], () =>
  gulp.src('node_modules/normalize.css/normalize.css').pipe(gulp.dest('public'))
);

gulp.task('build:app', [ 'clean:app' ], () =>
  rollup({
    input: 'app/index.js',
    plugins: [
      eslint({ throwError: env === 'production', configFile: '.eslintrc' }),
      resolve({ jsnext: true, browser: true }),
      babel({ exclude: 'node_modules/**' }),
      commonjs({ namedExports: reactNamedExports }),
      replace({
        ENV: env,
        'process.env.NODE_ENV': env
      }),
      env === 'production' && uglify()
    ]
  }).then(bundle => bundle.write({
    file: 'public/js/build.min.js',
    format: 'iife',
    sourcemap: 'inline'
  })).then(livereload())
);

gulp.task('lint:app', () =>
  gulp.src([ 'app/*.js', 'app/**/*.js' ])
    .pipe(gulpEslint({ configFile: '.eslintrc' }))
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failAfterError())
);

gulp.task('build:images', () =>
  gulp.src([ 'assets/*', 'assets/**/*' ])
    .pipe(imagemin())
    .pipe(gulp.dest('public/assets'))
);

gulp.task('watch', () => {
  livereload.listen();
  gulp.watch([ 'app/*.js', 'app/**/*.js' ], [ 'build:app' ]);
  gulp.watch([ 'assets/**', 'assets/*' ], [ 'build:images' ]);
});

gulp.task('browser', done => exec('open public/index.html', (err, stdout, stderr) => {
  if (stdout.trim()) console.log(stdout);
  if (stderr.trim()) console.error(stderr);
  done(err);
}));

gulp.task('develop', [ 'watch', 'browser' ]);
gulp.task('build', [ 'build:app', 'inject:normalize', 'build:images' ]);
gulp.task('default', [ 'build' ]);

