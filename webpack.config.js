const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  const mode = argv.mode
  const isProd = mode === 'production'

  const cssLoader = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: "css-loader",
      options: {
        url: false,
        sourceMap: ! isProd,
        importLoaders: 2,
      },
    },
  ]

  return {
    mode: isProd ? 'production' : 'development',
    entry: {
      bundle: path.resolve(__dirname, 'src/ts/index.ts'),
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'assets/js'),
      clean: true,
    },
    cache: ! isProd,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        {
          test: /\.css/,
          use: cssLoader,
        },
        {
          test: /\.s(c|a)ss/,
          use: [
            ...cssLoader,
            {
              loader: 'sass-loader',
              options: {
                sourceMap: ! isProd,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [
        '.ts', '.tsx', '.js', '.jsx',
      ],
    },
    plugins: [
      ...(
        isProd
          ?
            [
              new CopyWebpackPlugin({
                patterns: [{
                  from: path.resolve(__dirname, 'src/img'),
                  to: path.resolve(__dirname, 'assets/img'),
                }],
              }),
            ]
          : []
      ),
      ...[
        new MiniCssExtractPlugin({
          filename: '../css/[name].css',
        }),
      ],
    ],
  }
}
