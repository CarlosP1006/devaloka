const path = require('path');
const htmlPlugin = require('html-webpack-plugin');
const copyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const htmlPluginCfg = new htmlPlugin({
  template: path.resolve(__dirname, 'src/index.html'),
  filename: 'index.html',
  inject: 'body',
});

const copyPluginCfg = new copyPlugin({
  patterns: [
    { from: 'maps/*.json', to: 'maps/[name].json', noErrorOnMissing: true },
  ],
});

const tsconfigPathsPluginCfg = new TsconfigPathsPlugin();

module.exports = (_env, argv) => ({
  mode: argv && argv.mode === 'production' ? 'production' : 'development',
  entry: './src/game.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg)/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
      {
        test: /\.(ogg|wav|mp3)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/audio/[name][ext]',
        },
      },
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [htmlPluginCfg, copyPluginCfg],
  devServer: {
    static: path.resolve(__dirname, './dist'),
    host: '0.0.0.0',
    port: 8080,
    open: false,
    hot: true,
    watchFiles: ['src/**/*.ts', 'index.html'],
    client: {
      overlay: { warnings: false, errors: true },
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
        },
      }),
    ],
  },
  stats: 'errors-warnings',
  ignoreWarnings: [{ module: /awilix/, message: /Critical dependency/ }],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [tsconfigPathsPluginCfg],
  },
});
