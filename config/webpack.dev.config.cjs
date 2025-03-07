import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.base.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const devConfig = {
    mode: 'development',
    entry: path.join(__dirname, "../demo/src/index.tsx"),
    output: {
        path: path.join(__dirname, "../demo/src/"),
        filename: "dev.js",
    },
    module: {
        rules: [
            {
                test: /.s[ac]ss$/,
                exclude: /.min.css$/,
                use: [
                    { loader: 'style-loader' },
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
            {
                test: /.min.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    devServer: {
        static: path.join(__dirname, '../demo/src/'),
        compress: true,
        host: '127.0.0.1',
        port: 8001, // 启动端口
        open: true // 打开浏览器
    },
};
const exportConfig = merge(devConfig, baseConfig);
export default exportConfig;