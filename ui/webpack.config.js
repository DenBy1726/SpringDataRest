let path = require('path');

module.exports = {
    entry: "./src/web/app.js", // входная точка - исходный файл
    output:{
        path: path.resolve(__dirname, './public/'),     // путь к каталогу выходных файлов - папка public
        publicPath: '/public/',
        filename: "bundle.js"       // название создаваемого файла
    },
    devServer: {
        proxy: {
            '/api/v1/**': {
                target: { host: 'localhost', port: 8080, protocol: 'http:' },
                secure: false
            },
        },

        contentBase: path.resolve(__dirname, './public/'),
        historyApiFallback: true,
        port: 3000,
        hot: true,
        publicPath: '',
        compress: true,

        // to disable warnings
        // stats: {`
        //   warnings: false,
        // }
    },
    module:{
        rules:[   //загрузчик для jsx
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
                loader: "babel-loader",   // определяем загрузчик
                options:{
                    presets:["env", "react"]    // используемые плагины
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
}
