const path = require('path');
const chokidar = require('chokidar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const THEME_NAME = 'newenglish-starter';

module.exports = {
    entry: { 'assets': './assets/assets.dev.js' },
    output: { path: path.resolve(__dirname, 'dist'), filename: '[name].js', publicPath: `/wp-content/themes/${THEME_NAME}/dist/`, },
    resolve: {
        extensions: [ '.js', '.jsx', '.ts', '.tsx']
    },
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin({cleanAfterEveryBuildPatterns: ['!*.png', '!*.svg', '!*.jpg']}),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true,
        compress: true,
        contentBase: path.join(__dirname, 'dist'),
        writeToDisk: true,
        https: false,
        disableHostCheck: true,
        before(app, server) {
            chokidar.watch([ './**/*.php'], {ignored: ['node_modules/**/*', '.git/**/*', '.cache/']}).on('all', function () {
                server.sockWrite(server.sockets, 'content-changed');
            })
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader", // ESNext
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader', // Typescript!
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true }},
                    { loader: 'sass-loader', options: { sourceMap: true }},
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|eot|woff|woff2|otf|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    },
                }]
            }
        ]
    },
}