module.exports = {
  extends: [
      'eslint-config-alloy/react',
  ],
  rules: {
      // 一个缩进必须用两个空格替代
      'indent': [
          'error',
          2,
          {
              SwitchCase: 1,
              flatTernaryExpressions: true
          }
      ],
      // jsx 的 children 缩进必须为两个空格
      'react/jsx-indent': [
          'error',
          2
      ],
      // jsx 的 props 缩进必须为两个空格
      'react/jsx-indent-props': [
          'error',
          2
      ],
      'function-paren-newline': 'off'
  }
};