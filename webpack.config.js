let webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: "./abb.js",
    devtool: "source-map",
    output: {
        path: __dirname,
        filename: "abb.min.js"
    },
    optimization: {
        minimize: true
    }
};
