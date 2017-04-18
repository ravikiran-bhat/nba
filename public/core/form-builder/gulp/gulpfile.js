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

gulp.task('migrate-formbuilder', function() {
  return runSequence(
  ['clean-build'],['migrate-files'],['add-services', 'add-css', 'fb-css', 'add-fonts'],['inject-services'],['browserify-fb']
  );
});


gulp.task('browserify-fb', function() {
  return gulp.src(path.build.formbuilder.src, {
      read: false
    })
    .pipe(browserify({
      transform: ['html2js-browserify', 'browserify-css'],
    }))
    .pipe(unpathify())
    .pipe(uglify({
      mangle:{
        except : [
        '$scope', '$modalInstance', 'data'
        ]
      }
     }))
    .pipe(rename('fb-bundle.min.js'))
    .pipe(gulp.dest(path.build.dest));
});


gulp.task('add-css', function(cb) {
  //console.log("path", path);
  return gulp.src(path.assets.css.src)
    .pipe(gulp.dest(path.build.css.dest));
});

gulp.task('add-fonts', function(cb) {
  //console.log("path", path);
  return gulp.src(path.assets.fonts.src)
    .pipe(gulp.dest(path.build.fonts.dest));
});



gulp.task('fb-css', function() {
  return gulp.src(path.assets.less.src)
   .pipe(concat("all.less"))
    .pipe(less())
    .pipe(minifyCss())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.build.css.dest));
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

gulp.task('migrate-files', function(cb) {
  //console.log("path", path);
  return gulp.src(path.formbuilder.src)
    .pipe(gulp.dest(path.build.dest));
});

gulp.task('add-services', function(cb) {
  //console.log("path", path);
  return gulp.src(path.formbuilder.services.src)
    .pipe(gulp.dest(path.build.services.dest));
});

gulp.task('inject-css', function(cb) {
  //console.log("path", path);
  return gulp.src(path.build.formbuilder.src)
    .pipe(inject(gulp.src(path.build.css.src, {
                read: false
              }), {
          starttag: '// CSS GO HERE',
          endtag: '// CSS END HERE',
          transform: function(filepath, file, index, length, targetFile){
            var fileObj = new File(file);
            return "require('./css/"+fileObj.basename+"');";
          }
        }))
    .pipe(gulp.dest(path.build.dest))
});


gulp.task('inject-services', function(cb) {
  var requiredServices = [
    'alert',
    'app-cache',
    'utils',
    'modal',
    'library',
    'relay',
    'constants'
  ];
  var injectedServices = "";
  requiredServices.forEach(function(service){
    if(service==="constants"){
      injectedServices+=".constant('"+service+"',require('./services/"+service+"')())";
    }else{
    var serviceName = _.camelCase(service);
    injectedServices+=".service('"+serviceName+"Service',require('./services/"+service+"'))";
    }
  });

  return gulp.src(path.build.formbuilder.src) 
        .pipe(injectFunctionality(injectedServices, {
          starttag: '// SERVICES GO HERE',
          endtag: '// SERVICES END HERE',
        }))
        .pipe(gulp.dest(path.build.dest))
});


// gulp.task('add-directive', function(cb) {
//   console.log("add-directive")
// });


function injectFunctionality(requiredModules, options) {
  options.transform = function(filepath, file, i, length) {
    return requiredModules;
  };
  return inject(gulp.src(path.build.formbuilder.src, {
    read: false
  }), options);
}
