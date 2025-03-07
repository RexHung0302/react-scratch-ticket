export default {
  resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
      rules: [
          {
              test: /(\.js(x?))|(\.ts(x?))$/,
              use: [
                  { 
                      loader: 'babel-loader'
                  }
              ],
              exclude: /node_modules/,
          }
      ]
  },
};