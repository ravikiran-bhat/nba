var gulp         = require('gulp');
var rimraf       = require('gulp-rimraf');
var inject       = require('gulp-inject');  
var runSequence  = require('run-sequence');
var browserify   = require('gulp-browserify');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var less         = require('gulp-less');
var concat       = require('gulp-concat');
var minifyCss    = require('gulp-minify-css');
var unpathify    = require('gulp-unpathify');
var config       = require('./config.json');
var File         = require('vinyl');
_       = require('third-party-modules/lodash');
var path         = config.paths;

gulp.task('migrate-directive-components', function() {
  return runSequence(
  ['clean-build'], ['filter-directives']
  );
});

/*
  Clean build:
  Deletes previous build folder if found.
*/
gulp.task('clean-build', function(cb) {
  return gulp.src(path.build.src, {
      read: false
    })
    .pipe(rimraf({
      force: true
    }));
});

gulp.task('filter-directives', function(cb) {
  //console.log("path", path);
  return gulp.src(path.core.global.directives.src)
    .pipe(inject(gulp.src(path.core.global.directives.src, {
                read: false
              }), {
          starttag: '// EXCLUDE GO HERE',
          endtag: '// EXCLUDE END HERE',
          transform: function(filepath, file, index, length, targetFile){
            return "";
          }
        }))
    .pipe(browserify({
      transform: ['html2js-browserify', 'browserify-css'],
    }))
    .pipe(unpathify())
    // .pipe(uglify({
    //   mangle:{
    //     except : [
    //     '$scope', '$modalInstance', 'data'
    //     ]
    //   }
    //  }))
    .pipe(rename('global-directives.js'))
    .pipe(gulp.dest(path.build.dest))
});

