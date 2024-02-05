const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    entry: './src/index.tsx', // Точка входа вашего приложения
    output: {
        path: path.resolve(__dirname, '../dist'), // Путь для собранных файлов
        filename: 'bundle.js', // Имя собранного файла
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: ".",
                to: ".",
                context: "public"
            }]
        }),
    ],
};