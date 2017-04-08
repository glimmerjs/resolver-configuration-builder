const lint = require('mocha-eslint');

const paths = [
  'index.js',
  'lib/**/*.js',
  'test/**/*.js'
];

lint(paths);
