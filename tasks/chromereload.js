import gulp from 'gulp'
import gutil from 'gulp-util'
import livereload from 'gulp-livereload'
import args from './lib/args'

// In order to make chromereload work you'll need to include
// the following line in your `scipts/background.ts` file.
//
//    import 'chromereload/devonly';
//
// This will reload your extension everytime a file changes.
// If you just want to reload a specific context of your extension
// (e.g. `pages/options.html`) include the script in that context
// (e.g. `scripts/options.js`).
//
// Please note that you'll have to restart the gulp task if you
// create new file. We'll fix that when gulp 4 comes out.

gulp.task('chromereload', (cb) => {
  // This task runs only if the
  // watch argument is present!
  if (!args.watch) return cb()

  // Start livereload server
  livereload.listen({
    reloadPage: 'Extension',
    quiet: !args.verbose
  })

  gutil.log('Starting', gutil.colors.cyan('\'livereload-server\''))

  // The watching for javascript files is done by webpack
  // Check out ./tasks/scripts.js for further info.
  gulp.watch('src/manifest.json', gulp.task('manifest'))
  gulp.watch('src/styles/**/*.css', gulp.task('styles:css'))
  gulp.watch('src/styles/**/*.less', gulp.task('styles:less'))
  gulp.watch('src/styles/**/*.scss', gulp.task('styles:sass'))
  gulp.watch('src/_locales/**/*', gulp.task('locales'))
  gulp.watch('src/images/**/*', gulp.task('images'))
  gulp.watch('src/fonts/**/*.{woff,ttf,eot,svg}', gulp.task('fonts'))
})
