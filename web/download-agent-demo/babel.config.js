const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3 
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    isDev && require.resolve('react-refresh/babel'),
    [
      "@babel/plugin-proposal-decorators", { "legacy": true }
    ]
  ].filter(Boolean)
}
