const gulp       = require('gulp');
const clean      = require('gulp-clean');
const gulpEslint = require('gulp-eslint');
const imagemin   = require('gulp-imagemin');

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

gulp.task('default', [ 'inject:normalize', 'build:images' ]);
