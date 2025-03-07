import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.base.js';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonConfig = {
    mode: 'production',
    entry: path.join(__dirname, "../src/index.tsx"),
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
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "index.min.css"
        })
    ],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
};

const umdConfig = merge(commonConfig, baseConfig, {
    output: {
        path: path.join(__dirname, "../dist/"),
        filename: "index.js",
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
});

const esmConfig = merge(commonConfig, baseConfig, {
    output: {
        path: path.join(__dirname, "../dist/"),
        filename: "index.esm.js",
        libraryTarget: 'module',
        libraryExport: 'default',
    },
    experiments: {
        outputModule: true,
    },
});

export default [umdConfig, esmConfig];