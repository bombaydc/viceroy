module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'  
  ],
  rules: { 
    'no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true }],
    'no-console': 'warn',
    'no-debugger': 'error',
    'eqeqeq': ['error', 'always'], 
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      { allowExpressions: true, allowTypedFunctionExpressions: true }
    ],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-inferrable-types': 'off', 
    'prettier/prettier': 'error'
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/', 'build/', 'public/'],
};
