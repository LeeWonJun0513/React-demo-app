
const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);
module.exports = {
    entry: './src/app.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: WEBPACK_ENV === 'dev' ? '/dist/' : '//s.iwmake.com/shoppingmall-admin-react/dist/',
        filename: 'js/app.js'
    },
    resolve:{
        alias: {
            page      :path.resolve(__dirname, 'src/page'),
            component :path.resolve(__dirname, 'src/component'),
            util      :path.resolve(__dirname, 'src/util'),
            service   :path.resolve(__dirname, 'src/service')
        }
    },
    module:{
        rules: [
            // React syntax processing (JSX)
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env','react']
                    }
                }
            },
            // css Processing of documents
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            // Sass file processing
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            // Picture configuration
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            },
            // Font chart configuration
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // Process html
        new HtmlWebpackPlugin({
            template:'src/index.html',
            favicon:'./favicon.ico'
        }),
        // Independent css file
        new ExtractTextPlugin("css/[name].css"),
        // Propose a public module
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        })
    ],
    devServer: {
        port:8086,
        historyApiFallback:{
            index:'/dist/index.html'
        },
        proxy:{
            '/manage':{
                target:'http://admintest.happymmall.com',
                changeOrigin:true
            },
            '/user/logout.do':{
                target:'http://admintest.happymmall.com',
                changeOrigin:true
            }
        }
    }
};