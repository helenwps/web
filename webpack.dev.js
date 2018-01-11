var webpack = require("webpack");
var path = require('path');
var glob = require('glob');

//路径定义
var srcDir = path.resolve(process.cwd(), 'src/web');
var distDir = path.resolve(process.cwd(), 'dist');
var nodeModPath = path.resolve(__dirname, './node_modules');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, './src/web/static/', dir)
}

let isProd = process.env.isProd
// let siteConfig = require('./config/index')

// let siteEnv = {
//     name: 'lawyer pc',
// //  host: 'http://10.41.3.38:7300/mock/5a1b88789e336019cca7cf52/pc2.0'
//     host: 'http://10.41.3.15:7078'
// };
// let siteEnv = siteConfig[process.env.NODE_ENV +'Env']


var entries = function() {
	var jsDir = path.resolve(__dirname, srcDir+'/static/js/')
	var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
	var map = {};

	for (var i = 0; i < entryFiles.length; i++) {
		var filePath = entryFiles[i];
		var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
		map[filename] = filePath;
	}
	return map;
}

var html_plugins = function () {
    var entryHtml = glob.sync(srcDir + '/*.html')
    var r = []
    var entriesFiles = entries()
    for (var i = 0; i < entryHtml.length; i++) {
        var filePath = entryHtml[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        var conf = {
            template: '' + filePath,
            filename: distDir+'/'+filename + '.html'
        }
        if (filename in entriesFiles) {
            conf.inject = 'body'
            conf.chunks = ['vendor', filename]
        }
        r.push(new HtmlWebpackPlugin(conf))
    }
    return r
}

var plugins = [];
var extractCSS;
var cssLoader;
var sassLoader;
plugins.push(new CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity
}));

var debug = isProd ? false : true;
if(debug){
   extractCSS = new ExtractTextPlugin('css/[name].css?[contenthash]')
   cssLoader = extractCSS.extract(['css'])
   sassLoader = extractCSS.extract(['css', 'sass'])

   plugins.push(
       new webpack.DefinePlugin({
        // '__SiteEnv__': JSON.stringify(siteEnv),
        'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
        }),
       new webpack.HotModuleReplacementPlugin()
    )
}else{
   extractCSS = new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {allChunks: false})
   cssLoader = extractCSS.extract(['css?minimize'])
   sassLoader = extractCSS.extract(['css?minimize', 'sass'])

    plugins.push(
        // extractCSS,
        new webpack.DefinePlugin({
            // '__SiteEnv__': JSON.stringify(siteEnv),
            'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
            '__isProd__': process.env.NODE_ENV === 'prod'
        }),
        new UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            mangle: {
                except: ['$', 'exports', 'require']
            }
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(process.cwd(), 'src/web/static'),
                to: path.resolve(process.cwd(), 'dist/static'),
                ignore: ['js/*','js/base/*']
            }
        ])
        // new webpack.optimize.DedupePlugin(),
        // new webpack.NoErrorsPlugin()
    )
}

module.exports = {
    entry: Object.assign(entries(), {
        'vendor': ['jquery', 'base', 'md5', 'layer', 'doT', 'page']
    }),
    output: {
        path: path.resolve(__dirname, distDir),
        filename: 'static/js/[name].[hash:8].js',
        publicPath: './'
    },
    resolve: {
        extensions: ['.js', '.css', '.scss', '.tpl', '.png', '.jpg'],
        alias: {
            "base": resolve("js/base/base.js"),
            "jquery": resolve("lib/jquery-1.9.1.min.js"),
            "doT": resolve("lib/doT.min.js"),
            "md5": resolve("lib/md5.js"),
            "layer": resolve("lib/layer/layer.js"), 
            "page": resolve("lib/page.js"),
            "share": resolve("lib/share.js"),
            "fullPage": resolve("lib/jquery.fullPage.js"),
            "swiper": resolve("lib/swiper.min.js")
            // "HHAjax": resolve("js/utils/ajax.js"),
            // "lawyer": resolve("lib/public_module.js"),
        }
    },
    plugins: plugins.concat(html_plugins()),
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules|lib/],
                loader: 'babel-loader'
            }
        ]
    }
};