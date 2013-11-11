
/**
 * Base constructs
 */

exports.Statement =
exports.Expression = skip;

exports.Literal =
exports.Identifier =
exports.EmptyStatement =
exports.ThisExpression =
exports.BreakStatement =
exports.ContinueStatement =
exports.DebuggerStatement = ignore;

/**
 * Parser constructs
 */

exports.Program =
exports.BlockStatement = function(node, fn) {
  for (var i = 0; i < node.body.length; ++i) {
    node.body[i].parent = node;
    fn(node.body[i], 'Statement');
  }
};

exports.ExpressionStatement = function(node, fn) {
  node.expression.parent = node;
  fn(node.expression, 'Expression');
};

exports.IfStatement = function(node, fn) {
  node.test.parent = node;
  fn(node.test, 'Expression');

  node.consequent.parent = node;
  fn(node.consequent, 'Statement');

  if (node.alternate) {
    node.alternate.parent = node;
    fn(node.alternate, 'Statement');
  }
}

exports.LabeledStatement = function(node, fn) {
  node.body.parent = node;
  fn(node.body, 'Statement');
};

exports.WithStatement = function(node, fn) {
  node.object.parent = node;
  fn(node.object, 'Expression');

  node.body.parent = node;
  fn(node.body, 'Statement');
};

exports.SwitchStatement = function(node, fn) {
  node.discriminant.parent = node;
  fn(node.discriminant, 'Expression');

  for (var i = 0; i < node.cases.length; ++i) {
    var cs = node.cases[i];
    if (cs.test) {
      cs.test.parent = node;
      fn(cs.test, 'Expression');
    }

    for (var j = 0; j < cs.consequent.length; ++j) {
      cs.consequent[j].parent = node;
      fn(cs.consequent[j], 'Statement');
    }
  }
};

exports.ReturnStatement = function(node, fn) {
  if (node.argument) {
    node.argument.parent = node;
    fn(node.argument, 'Expression');
  }
};

exports.ThrowStatement = function(node, fn) {
  node.argument.parent = node;
  fn(node.argument, 'Expression');
};

exports.TryStatement = function(node, fn) {
  node.block.parent = node;
  fn(node.block, 'Statement');

  if (node.handler) {
    node.handler.body.parent = node;
    fn(node.handler.body, 'ScopeBody');
  }

  if (node.finalizer) {
    node.finalizer.parent = node;
    fn(node.finalizer, 'Statement');
  }
};

exports.WhileStatement =
exports.DoWhileStatement = function(node, fn) {
  node.test.parent = node;
  fn(node.test, 'Expression');

  node.body.parent = node;
  fn(node.body, 'Statement');
};

exports.ForStatement = function(node, fn) {
  if (node.init) {
    node.init.parent = node;
    fn(node.init, 'ForInit');
  }

  if (node.test) {
    node.test.parent = node;
    fn(node.test, 'Expression');
  }

  if (node.update) {
    node.update.parent = node;
    fn(node.update, 'Expression');
  }

  node.body.parent = node;
  fn(node.body, 'Statement');
};

exports.ForInStatement = function(node, fn) {
  node.left.parent = node;
  fn(node.left, 'ForInit');

  node.right.parent = node;
  fn(node.right, 'Expression');

  node.body.parent = node;
  fn(node.body, 'Statement');
};

exports.ForInit = function(node, fn) {
  if (node.type == 'VariableDeclaration') fn(node);
  else fn(node, 'Expression');
};

exports.Function = function(node, fn) {
  node.body.parent = node;
  fn(node.body, 'ScopeBody');
};

exports.FunctionExpression =
exports.FunctionDeclaration = function(node, fn) {
  fn(node, 'Function');
};

exports.VariableDeclaration = function(node, fn) {
  for (var i = 0; i < node.declarations.length; ++i) {
    var decl = node.declarations[i];
    if (decl.init) {
      decl.init.parent = node;
      fn(decl.init, 'Expression');
    }
  }
};

exports.ScopeBody = function(node, fn) {
  fn(node, 'Statement');
};

exports.ArrayExpression = function(node, fn) {
  for (var i = 0; i < node.elements.length; ++i) {
    var elt = node.elements[i];
    if (elt) {
      elt.parent = node;
      fn(elt, 'Expression');
    }
  }
};

exports.ObjectExpression = function(node, fn) {
  for (var i = 0; i < node.properties.length; ++i) {
    node.properties[i].value.parent = node;
    fn(node.properties[i].value, 'Expression');
  }
};

exports.SequenceExpression = function(node, fn) {
  for (var i = 0; i < node.expressions.length; ++i) {
    node.expressions[i].parent = node;
    fn(node.expressions[i], 'Expression');
  }
};

exports.UnaryExpression =
exports.UpdateExpression = function(node, fn) {
  node.argument.parent = node;
  fn(node.argument, 'Expression');
};

exports.BinaryExpression =
exports.LogicalExpression =
exports.AssignmentExpression = function(node, fn) {
  node.left.parent = node;
  fn(node.left, 'Expression');

  node.right.parent = node;
  fn(node.right, 'Expression');
};

exports.ConditionalExpression = function(node, fn) {
  node.test.parent = node;
  fn(node.test, 'Expression');

  node.consequent.parent = node;
  fn(node.consequent, 'Expression');

  node.alternate.parent = node;
  fn(node.alternate, 'Expression');
};

exports.NewExpression =
exports.CallExpression = function(node, fn) {
  node.callee.parent = node;
  fn(node.callee, 'Expression');

  if (!node.arguments) return;

  for (var i = 0; i < node.arguments.length; ++i) {
    node.arguments[i].parent = node;
    fn(node.arguments[i], 'Expression');
  }
};

exports.MemberExpression = function(node, fn) {
  node.object.parent = node;
  fn(node.object, 'Expression');

  if (node.computed) {
    node.property.parent = node;
    fn(node.property, 'Expression');
  }
};

/**
 * Utilities
 */

function skip(node, fn) {
  fn(node, false);
}

function ignore(node, fn) {}
