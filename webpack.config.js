const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
  {
    entry: "./src/server.ts",
    target: "node",
    output: {
      filename: "server.js",
      path: path.resolve(__dirname, "dist")
    },
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          loader: "ts-loader",
          exclude: "/node_modules/"
        }
      ]
    },
    node: {
      __dirname: true
    },
    externals: [nodeExternals()]
  },
  {
    entry: "./public/ts/main.ts",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "public_dist")
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader"
            },
            "sass-loader"
          ]
        },
        {
          test: /\.(ts|js)x?$/,
          loader: "babel-loader"
        },
        {
          test: /\.(png|jpg|svg)$/,
          loader: "url-loader"
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "app.css"
      })
    ]
  },
  {
    entry: "./public/js/belight_autocomplete.js",
    output: {
      filename: "bundle_autocomplete.js",
      path: path.resolve(__dirname, "public_dist")
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.(js)x?$/,
          loader: "babel-loader"
        }
      ]
    }
  },
  {
    entry: "./public/js/belight_maps.js",
    output: {
      filename: "bundle_maps.js",
      path: path.resolve(__dirname, "public_dist")
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.(js)x?$/,
          loader: "babel-loader"
        }
      ]
    }
  },
  {
    entry: "./public/js/place_autocomplete.js",
    output: {
      filename: "bundle_placecomplete.js",
      path: path.resolve(__dirname, "public_dist")
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.(js)x?$/,
          loader: "babel-loader"
        }
      ]
    }
  }
];
