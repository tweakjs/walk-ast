var types = require('./types');

/**
 * Walk the entire tree
 *
 * @param {Object} node
 * @param {Function} fn
 */

exports.walk = function(node, fn) {
  if (!node) return this;
  node = (1 == arguments.length) ? this.root : node;

  function walk(n, override) {
    if (false === override) fn(n);
    var type = override || n.type;
    types[type](n, walk)
  }

  node.parent = false;
  walk(node, false);
  delete node.parent;
}
