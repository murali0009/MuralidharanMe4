const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin('vendor.css');
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        resolve: { extensions: [ '.js' ] },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        },
        entry: {
            vendor: [
                '@angular/animations',
                '@angular/common',
                '@angular/compiler',
                '@angular/core',
                '@angular/forms',
                '@angular/http',
                '@angular/platform-browser',
                '@angular/platform-browser-dynamic',
                '@angular/router',
                '@angular/material',
                '@progress/kendo-angular-l10n',
                '@progress/kendo-angular-buttons',
                '@progress/kendo-angular-label',
                '@progress/kendo-angular-dropdowns',
                '@progress/kendo-angular-inputs',
                '@progress/kendo-angular-intl',
                '@progress/kendo-angular-dateinputs',
                'bootstrap',
                'bootstrap/dist/css/bootstrap.css',
                'es6-shim',
                'es6-promise',
                'event-source-polyfill',
                'jquery',
                'zone.js',
            ]
        },
        output: {
            publicPath: '/dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/11580
            new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/14898
            new webpack.IgnorePlugin(/^vertx$/)// Workaround for https://github.com/stefanpenner/es6-promise/issues/100
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        output: { path: path.join(__dirname, 'wwwroot', 'dist') },
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: extractCSS.extract({ use: isDevBuild ? 'css-loader' : 'css-loader?minimize' }) }
            ]
        },
        plugins: [
            extractCSS,
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            }),
            new CopyWebpackPlugin([
                { from: './node_modules/@progress/kendo-theme-default/dist/all.css', to: path.join(__dirname, 'wwwroot','css') },
            ])
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    //const serverBundleConfig = merge(sharedConfig, {
    //    target: 'node',
    //    resolve: { mainFields: ['main'] },
    //    output: {
    //        path: path.join(__dirname, 'ClientApp', 'dist'),
    //        libraryTarget: 'commonjs2',
    //    },
    //    module: {
    //        rules: [ { test: /\.css(\?|$)/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize' ] } ]
    //    },
    //    entry: { vendor: ['aspnet-prerendering'] },
    //    plugins: [
    //        new webpack.DllPlugin({
    //            path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
    //            name: '[name]_[hash]'
    //        })
    //    ]
    //});

    //return [clientBundleConfig, serverBundleConfig];
    return [clientBundleConfig];
}
