import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.base.js';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const esmConfig = {
    mode: 'production',
    entry: path.join(__dirname, "../src/index.tsx"),
    output: {
        path: path.join(__dirname, "../dist/"),
        filename: "index.esm.js",
        libraryTarget: 'module',
        module: true,
    },
    experiments: {
        outputModule: true,
    },
    module: {
        rules: [
            {
                test: /.s[ac]ss$/,
                exclude: /.min.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: "global"
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'postcss-preset-env',
                                    ],
                                ],
                            },
                        },
                    },
                    { loader: 'sass-loader' }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "index.min.css"
        })
    ],
    externals: {
        react: 'react',
        'react-dom': 'react-dom'
    },
    externalsType: 'module',
};

export default merge(esmConfig, baseConfig);