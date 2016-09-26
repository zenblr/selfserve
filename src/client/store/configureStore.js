if (process.env.NODE_ENV !== 'xxx') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}