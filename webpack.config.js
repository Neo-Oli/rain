const path = require('path')
module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: "dist"
                        },
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    output: {
        path: path.join(__dirname, `/dist`),
        publicPath: '/',
        filename: 'bundle.js',
        libraryTarget: 'var',
        library: 'rain'
    },
    devServer: {
        contentBase: './dist'
    }
}
