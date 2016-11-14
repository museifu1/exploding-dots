module.exports = {
    entry: "./src/App.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
        library: 'testApp',
        libraryTarget: 'umd'
    },
    /*externals: {
     'react': 'var React',
     'react/addons': 'var React'
   },*/
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react'
      }
    },
    module: {
        loaders: [
            {
              test: /\.css$/,
              loader: "style!css"
            },
            {
              test: /(\.js)|(\.jsx)$/,
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                presets: ['es2015', 'react', 'stage-0']
              }
            }
        ]
    }
};
