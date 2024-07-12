import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default  {
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.pug$/,
                use: ['html-loader', 'pug-html-loader'],
            },
        ],
    },
    entry: {
        'script': './src/views/list.pug',
        'style': './src/styles/style.sass'
    },
    output: {
        path: path.resolve('./', 'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },
    externals: {
        express: 'express',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/views/list.pug',
            filename: 'html/list.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/main.css',
        }),
    ],
};