import gulp from 'gulp'
import gulpif from 'gulp-if'
import { log, colors } from 'gulp-util'
import named from 'vinyl-named'
import webpack from 'webpack'
import gulpWebpack from 'webpack-stream'
import BabiliPlugin from 'babili-webpack-plugin'
import plumber from 'gulp-plumber'
import livereload from 'gulp-livereload'
import args from './lib/args'
import TerserPlugin from 'terser-webpack-plugin';

const ENV = args.production ? 'production' : 'development'

gulp.task('scripts', (cb) => {
  return gulp.src(['app/scripts/*.js', 'app/scripts/*.ts', 'app/scripts/*.tsx', 'app/scripts/*.scss'])
    .pipe(plumber({
      // Webpack will log the errors
      errorHandler () {}
    }))
    .pipe(named())
    .pipe(gulpWebpack({
      devtool: args.sourcemaps ? 'inline-source-map' : false,
      watch: args.watch,
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(ENV),
          'process.env.VENDOR': JSON.stringify(args.vendor)
        })
      ].concat(args.production ? [
        new BabiliPlugin()
      ] : []),
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
          },
          {
            test: /\.scss$/,
            use: [
              'style-loader',
              // 'css-modules-typescript-loader',
              {
                loader: 'css-loader',
                options :{
                  modules : true
                }
              },
              // 'postcss-loader',
              'sass-loader'
            ]
          },
          {
            test: /\.svg$/,
            exclude: /node_modules/,
            use: [
              'svg-react-loader'
            ]
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js', 'scss', 'svg'],
        modules: [
          'node_modules/',
          'app/scripts/'
        ]
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              ecma: 6,
              output: { 
                 ascii_only: true 
              },
            },
          }),
        ],
      }
    },
    webpack,
    (err, stats) => {
      if (err) return
      log(`Finished '${colors.cyan('scripts')}'`, stats.toString({
        chunks: false,
        colors: true,
        cached: false,
        children: false
      }))
    }))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()))
})
