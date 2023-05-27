const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const path = require("path")
const packageJson = require("../package.json")

module.exports = options => {
    const isProduction = !!options.mode && ["dev", "stg", "prod", "qa"].includes(options.mode)
    console.log("isProduction? = ", isProduction)
    console.log("env mode? = ", options.mode)

    const webpackConfig = {
        entry: path.resolve(__dirname, "../src/main.tsx"),
        target: "web",
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".scss"],
            alias: {
                "@": path.resolve(__dirname, "../src/app/"),
                "@lib": path.resolve(__dirname, "../src/lib/"),
                "@assets": path.resolve(__dirname, "../src/assets/"),
            },
        },
        plugins: [
            new webpack.BannerPlugin({
                entryOnly: true,
                raw: true,
                banner: 'typeof window !== "undefined" &&',
            }),
            new webpack.DefinePlugin({
                __VERSION__: JSON.stringify(packageJson.version),
            }),
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/core$/,
                contextRegExp: /material-ui$/,
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "../static"),
                        noErrorOnMissing: true,
                    },
                ],
                options: {
                    concurrency: 100,
                },
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "../src/index.html"),
                minify: true,
            }),
            new CleanWebpackPlugin({
                root: __dirname,
                verbose: true,
                dry: false,
            }),
            new MiniCssExtractPlugin({
                ignoreOrder: true,
            }),
        ].filter(Boolean),
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    exclude: [path.resolve(__dirname, "../node_modules"), path.resolve(__dirname, "../src/lib")],
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                babelrc: false,
                                presets: [
                                    "@babel/preset-typescript",
                                    [
                                        "@babel/preset-react",
                                        {
                                            runtime: "automatic",
                                        },
                                    ],
                                    [
                                        "@babel/preset-env",
                                        {
                                            loose: true,
                                            modules: false,
                                            targets: {
                                                browsers: ["chrome >= 47", "firefox >= 51", "ie >= 11", "safari >= 8", "ios >= 8", "android >= 4"],
                                            },
                                        },
                                    ],
                                ],
                                cacheDirectory: isProduction,
                                cacheCompression: false,
                                compact: isProduction,
                                plugins: [
                                    ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
                                    ["@babel/plugin-transform-object-assign", { loose: true }],
                                    ["@babel/plugin-proposal-optional-chaining", { loose: true }],
                                    "@babel/plugin-transform-runtime",
                                ],
                            },
                        },
                    ].filter(Boolean),
                },
                // {
                //     test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                //     use: [
                //         isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                //         'css-loader',
                //         'postcss-loader',
                //       {
                //         loader: 'sass-loader'
                //       },
                //     ]
                //   },
                {
                    test: /\.(c|sa|sc)ss$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                        "postcss-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                additionalData: '@import "@assets/styles/variables.scss";',
                            },
                        },
                    ],
                },
                {
                    test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                    type: "asset/source",
                },
                {
                    test: /\.(svg|png|jpe?g|gif|ico)$/i,
                    type: "asset/inline",
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "[name][ext]",
                    },
                },
            ],
        },
        optimization: {
            runtimeChunk: "single",
            minimize: isProduction,
            removeAvailableModules: isProduction,
            removeEmptyChunks: isProduction,
            usedExports: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
                // 문법변환 에러로 인해 주석 처리
                // new CssMinimizerPlugin(),
            ].filter(Boolean),
            splitChunks: {
                chunks: "async",
                minSize: 30720,
                minChunks: 1,
                maxAsyncRequests: 6,
                maxInitialRequests: 4,
                automaticNameDelimiter: "-",
                name: false,
                cacheGroups: {
                    commons: {
                        name: "commons",
                        chunks: "initial",
                        minChunks: 2,
                    },
                    vender: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: "all",
                        enforce: true,
                        filename: "vendor/vendor.[contenthash].js",
                        priority: -10,
                    },
                    styles: {
                        test: /\.scss$/,
                        name: "styles",
                        chunks: "all",
                        enforce: true,
                    },
                },
            },
        },
        node: {
            global: false,
            __filename: false,
            __dirname: false,
        },
    }

    return webpackConfig
}
