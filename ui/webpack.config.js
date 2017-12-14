const path = require('path');
const fs  = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './ant-theme-vars.less'), 'utf8'));

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
                secure: true
            },
            '/auth/v1/**': {
                target: { host: 'localhost', port: 8080, protocol: 'http:' },
                secure: true
            },
        },

        contentBase: path.resolve(__dirname, './public/'),
        historyApiFallback: true,
        port: 3000,
        hot: true,
        inline: true,
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
                    presets:["env", "react"],    // используемые плагины
                    plugins: [
                        ['import', { libraryName: "antd", style: true }]
                    ]
                },
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.less$/, use: [
                {loader: "style-loader"},
                {loader: "css-loader"},
                {loader: "less-loader",
                    options: {
                        modifyVars: themeVariables
                    }
                }
                ]
            }
        ]

    },
    devtool: 'cheap-module-source-map'
}
