const { merge } = require("webpack-merge")
const defualtConfig = require("./webpack.common.js")
const Dotenv = require("dotenv-webpack")
const path = require("path")
// const ESLintPlugin = require("eslint-webpack-plugin")

module.exports = args =>
    merge(defualtConfig(args), {
        // stats: 'errors-warnings',
        mode: "development",
        devtool: "eval-cheap-module-source-map",
        cache: {
            type: "filesystem",
            buildDependencies: {
                config: [__filename],
            },
        },
        output: {
            filename: "js/[contenthash].js",
            chunkFilename: "js/[name].[contenthash].js",
            assetModuleFilename: "@assets/[contenthash][ext][query]",
            path: path.resolve(__dirname, "../dist"),
            publicPath: "/",
        },
        devServer: {
            //hot: true, // 핫 모듈 교체(HMR) 활성화 설정, true 일시 자동 업데이트
            static: false,
            port: 8080,
            historyApiFallback: {
                index: "/",
            },
            // proxy: {
            //     "/api": {
            //         target: "https://bo-dev-api.aws.tving.com/",
            //         ws: true,
            //         secure: false,
            //         changeOrigin: true,
            //     },
            // },
        },
        plugins: [
            new Dotenv({ path: path.resolve(__dirname, `../.env.${args.mode}`), systemvars: true }),
            // 에러 갯수가 많아 빌드 속도 느려져서 주석처리, 1차로 리팩토링 처리 되면 주석 해제하여 검사
            // new ESLintPlugin({
            //     extensions: ["js", "jsx", "ts", "tsx"],
            // }),
        ],
        optimization: {
            runtimeChunk: "single",
            splitChunks: false,
        },
    })
