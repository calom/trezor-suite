import path from 'path';

module.exports = {
    target: 'browserslist',
    mode: 'production',
    entry: path.resolve(__dirname, './src/browser-detection/index.ts'),
    output: {
        path: path.resolve(__dirname, 'files/browser-detection'),
        filename: 'index.js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[name]__[local]',
                            },
                        },
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
    performance: {
        hints: false,
    },
};
