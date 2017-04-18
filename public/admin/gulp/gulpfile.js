var gulp            = require('gulp');
var plugins         = require('gulp-load-plugins')({config: '../../package.json'});
var argv            = require('minimist')(process.argv.slice(2));
var watchify        = require('watchify');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var runSequence     = require('run-sequence');
var config          = require('./config.json');

var path            = config.paths;
var modules         = argv.modules ? argv.modules.split(',') : [];
var ENV             = argv.env ? argv.env : config.env;
var bundler         = null;



gulp.task('build', function() {
  runSequence(
    ['clean-build'], ['create-build'], ['delete-extras', 'set-modules'], ['browserify', 'lessify'], onBuild
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
    .pipe(plugins.rimraf({
      force: true
    }));
});


/*
  create-build:
   - copy-assets:
     - Copies assets folder and pastes it inside build folder.
  
   - copy-index:
     1. Adds random number to scripts inside index.html file.
     2. Renames the script tag string "built.js" to "built.min.js" if environment is set to prod.
     3. Copies index.html and pastes it inside the build folder.
*/
gulp.task('create-build', ['copy-assets', 'copy-index']);

gulp.task('copy-assets', function() {
  return gulp.src(path.assets.src)
    .pipe(gulp.dest(path.build.assets.dest));
});

gulp.task('copy-manifest', function() {
  return gulp.src(path.public.manifest.src)
    .pipe(gulp.dest(path.build.dest));
});


gulp.task('copy-index', function() {
  var rand = Math.floor(Math.random() * 1000000000);

  return gulp.src(path.public.index.src)
    // Set random number to each js files in index.html for avoiding cache issues(ONLY IF PROD)
    .pipe(plugins.replace('@RAND', rand))
    .pipe(plugins.if(ifProd, plugins.replace('js/built.js', 'js/built.min.js')))
    .pipe(gulp.dest(path.build.dest))
});



/*
  Deletes extra files and folders unwanted in the final build.
  Folders and files deleted are:
  - less
  - smart-admin/less
*/
gulp.task('delete-extras', function(cb) {
  return gulp.src(path.build.assets.less.src, {
      read: false
    })
    .pipe(plugins.rimraf({
      force: true
    }));
});



/*
  Set modules:
    - set-angular-modules
      1. Reads modules from command line arguments or config.json.
      2. Adds a require string of mentioned modules in admin.js.
         Eg: If extensions module is provided in the command line interface or in the config.json file,
         the task adds the following line in admin.js file within the "PLUGINS GO HERE" and "PLUGINS END HERE" comments block.
         var extensions = require('../extensions/extensions');
      3. By default it adds all 4 modules in admin.js.

    - set less modules
      1. Similar to set-angular-modules task, this task performs the same operation on main.less file.
      2. Eg: If extensions module is provided in the command line interface or in the config.json file,
         the task adds the following line in main.less file within the "PLUGINS GO HERE" and "PLUGINS END HERE" comments block.
         @import "plugins/extensions/extensions.less";
      3. By default it adds all 4 modules in main.less.
*/
gulp.task('set-modules', ['set-less-modules']);

gulp.task('set-angular-modules', function() {
  return gulp.src(path.admin.js.src)
    .pipe(injectAngularModules())
    .pipe(gulp.dest(path.admin.dest))
});

gulp.task('set-less-modules', function() {
  return gulp.src(path.assets.less.main.src)
    //.pipe(injectLessModules())
    .pipe(gulp.dest(path.assets.less.dest))
});


/*
  Browserify: Runs browserify task on the main js file (admin.js) and saves the 
  output file to "build/js" directory as "built.js" OR "built.min.js" for dev and prod environment respectively. 
*/

gulp.task('browserify', function() {
  bundler = ifProd() ? browserify(path.admin.js.src, config.browserify) : watchify(browserify(path.admin.js.src, config.browserify));
  bundler.transform('html2js-browserify');

  if (!ifProd())
    bundler.on('update', bundle);

  return bundle();
});


/*
  Lessify: LESS to CSS compiler.
   - builtio-css:
     Compiles main.less file which includes all the built less files
     and saves the output css file to "build/css" directory as style.css
  
   - smartadmin-css"
     Compiles smartadmin-production.less file which includes all the smartadmin less files
     and saves the output css file to "build/css" directory as smartadmin-production.min.css
*/
gulp.task('lessify', function() {
  console.log("Lessifying...");
  runSequence(['builtio-css', 'bootstrap-css', 'smartadmin-css']);
});

gulp.task('builtio-css', function() {
  console.log("Lessifying built less files...")
  return gulp.src(path.assets.less.main.src)
    .pipe(plugins.less())
    //.pipe(plugins.minifyCss())
    .pipe(plugins.rename("style.css"))
    .pipe(gulp.dest(path.build.assets.css.dest))
});

gulp.task('bootstrap-css', function() {
  console.log("Lessifying Bootstrap less files...")
  return gulp.src(path.assets.smartAdmin.less.bootstrap.src)
    .pipe(plugins.less())
    //.pipe(plugins.minifyCss())
    .pipe(plugins.rename("bootstrap.min.css"))
    .pipe(gulp.dest(path.build.assets.css.dest))
});

gulp.task('smartadmin-css', function() {
  console.log("Lessifying SmartAdmin less files...")
  return gulp.src(path.assets.smartAdmin.less.smartAdminProduction.src)
    .pipe(plugins.less())
    //.pipe(plugins.minifyCss())
    .pipe(plugins.rename("smartadmin-production.min.css"))
    .pipe(gulp.dest(path.build.assets.smartAdmin.css.dest))
});


/*
  build-super-admin:
  - Initiates super admin build process by executing command from command line.
*/
gulp.task('build-super-admin', function() {
  console.log('Building super admin...')
  var buildCmd = 'gulp build ' + (ifProd() ? '--env=prod' : '');
  return gulp.src('', {read: false})
    .pipe(plugins.shell([
      buildCmd
    ], {cwd: path.super_admin.gulp.src}));
})


function injectAngularModules() {

  var requiredModules = "";

  return plugins.inject(gulp.src(path.admin.js.src, {
    read: false
  }), {
    starttag: '// PLUGINS GO HERE',
    endtag: '// PLUGINS END HERE',
    transform: function(filepath, file, i, length) {
      return requiredModules;
    }
  })
}

function injectLessModules() {
  var requiredModules = "";
  
  return plugins.inject(gulp.src(path.assets.less.main.src, {
    read: false
  }), {
    starttag: '// PLUGINS GO HERE',
    endtag: '// PLUGINS END HERE',
    transform: function(filepath, file, i, length) {
      return requiredModules;
    }
  })
}

function ifProd() {
  return ENV === "prod";
}

function bundle() {
  console.log('Browserifying ...');
  return bundler.bundle()
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source('./bundle.js'))
    .pipe(plugins.if(ifProd, plugins.unpathify()))
    .pipe(plugins.if(ifProd, buffer()))
    .pipe(plugins.if(ifProd, plugins.uglify({
      mangle: false,
      compress: {
        drop_console: true
      }
    })))
    // .pipe(plugins.if(ifProd, plugins.compressor({'remove-intertag-spaces': true,'executeOption': {
    //     maxBuffer: 10000*1024
    // }})))
    .pipe(plugins.if(ifProd, plugins.rename("built.min.js"), plugins.rename("built.js")))
    .pipe(gulp.dest(path.build.assets.js.dest))
}



function onBuild() {
  
  if(ifProd()){
    runSequence(['build-super-admin']);
    return;
  }

  watch();
}


function watch() {
    gulp.watch(path.assets.less.all.src, ['lessify'])
    gulp.watch(path.public.index.src, ['copy-index'])
}