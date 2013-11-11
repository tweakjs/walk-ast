
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
    delete node.body[i].parent;
  }
};

exports.ExpressionStatement = function(node, fn) {
  node.expression.parent = node;
  fn(node.expression, 'Expression');
  delete node.expression.parent;
};

exports.IfStatement = function(node, fn) {
  node.test.parent = node;
  fn(node.test, 'Expression');
  delete node.test.parent;

  node.consequent.parent = node;
  fn(node.consequent, 'Statement');
  delete node.consequent.parent;

  if (node.alternate) {
    node.alternate.parent = node;
    fn(node.alternate, 'Statement');
    delete node.alternate.parent;
  }
}

exports.LabeledStatement = function(node, fn) {
  node.body.parent = node;
  fn(node.body, 'Statement');
  delete node.body.parent;
};

exports.WithStatement = function(node, fn) {
  node.object.parent = node;
  fn(node.object, 'Expression');
  delete node.object.parent;

  node.body.parent = node;
  fn(node.body, 'Statement');
  delete node.body.parent;
};

exports.SwitchStatement = function(node, fn) {
  node.discriminant.parent = node;
  fn(node.discriminant, 'Expression');
  delete node.discriminant.parent;

  for (var i = 0; i < node.cases.length; ++i) {
    var cs = node.cases[i];
    if (cs.test) {
      cs.test.parent = node;
      fn(cs.test, 'Expression');
      delete cs.test.parent;
    }

    for (var j = 0; j < cs.consequent.length; ++j) {
      cs.consequent[j].parent = node;
      fn(cs.consequent[j], 'Statement');
      delete cs.consequent[j].parent;
    }
  }
};

exports.ReturnStatement = function(node, fn) {
  if (node.argument) {
    node.argument.parent = node;
    fn(node.argument, 'Expression');
    delete node.argument.parent;
  }
};

exports.ThrowStatement = function(node, fn) {
  node.argument.parent = node;
  fn(node.argument, 'Expression');
  delete node.argument.parent;
};

exports.TryStatement = function(node, fn) {
  node.block.parent = node;
  fn(node.block, 'Statement');
  delete node.block.parent;

  if (node.handler) {
    node.handler.body.parent = node;
    fn(node.handler.body, 'ScopeBody');
    delete node.handler.body.parent;
  }

  if (node.finalizer) {
    node.finalizer.parent = node;
    fn(node.finalizer, 'Statement');
    delete node.finalizer.parent;
  }
};

exports.WhileStatement =
exports.DoWhileStatement = function(node, fn) {
  node.test.parent = node;
  fn(node.test, 'Expression');
  delete node.test.parent;

  node.body.parent = node;
  fn(node.body, 'Statement');
  delete node.body.parent;
};

exports.ForStatement = function(node, fn) {
  if (node.init) {
    node.init.parent = node;
    fn(node.init, 'ForInit');
    delete node.init.parent;
  }

  if (node.test) {
    node.test.parent = node;
    fn(node.test, 'Expression');
    delete node.test.parent;
  }

  if (node.update) {
    node.update.parent = node;
    fn(node.update, 'Expression');
    delete node.update.parent;
  }

  node.body.parent = node;
  fn(node.body, 'Statement');
  delete node.body.parent;
};

exports.ForInStatement = function(node, fn) {
  node.left.parent = node;
  fn(node.left, 'ForInit');
  delete node.left.parent;

  node.right.parent = node;
  fn(node.right, 'Expression');
  delete node.right.parent;

  node.body.parent = node;
  fn(node.body, 'Statement');
  delete node.body.parent;
};

exports.ForInit = function(node, fn) {
  if (node.type == 'VariableDeclaration') fn(node);
  else fn(node, 'Expression');
};

exports.Function = function(node, fn) {
  node.body.parent = node;
  fn(node.body, 'ScopeBody');
  delete node.body.parent;
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
      delete decl.init.parent;
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
      delete elt.parent;
    }
  }
};

exports.ObjectExpression = function(node, fn) {
  for (var i = 0; i < node.properties.length; ++i) {
    node.properties[i].value.parent = node;
    fn(node.properties[i].value, 'Expression');
    delete node.properties[i].value.parent;
  }
};

exports.SequenceExpression = function(node, fn) {
  for (var i = 0; i < node.expressions.length; ++i) {
    node.expressions[i].parent = node;
    fn(node.expressions[i], 'Expression');
    delete node.expressions[i].parent;
  }
};

exports.UnaryExpression =
exports.UpdateExpression = function(node, fn) {
  node.argument.parent = node;
  fn(node.argument, 'Expression');
  delete node.argument.parent;
};

exports.BinaryExpression =
exports.LogicalExpression =
exports.AssignmentExpression = function(node, fn) {
  node.left.parent = node;
  fn(node.left, 'Expression');
  delete node.left.parent;

  node.right.parent = node;
  fn(node.right, 'Expression');
  delete node.right.parent;
};

exports.ConditionalExpression = function(node, fn) {
  node.test.parent = node;
  fn(node.test, 'Expression');
  delete node.test.parent;

  node.consequent.parent = node;
  fn(node.consequent, 'Expression');
  delete node.consequent.parent;

  node.alternate.parent = node;
  fn(node.alternate, 'Expression');
  delete node.alternate.parent;
};

exports.NewExpression =
exports.CallExpression = function(node, fn) {
  node.callee.parent = node;
  fn(node.callee, 'Expression');
  delete node.callee.parent;

  if (!node.arguments) return;

  for (var i = 0; i < node.arguments.length; ++i) {
    node.arguments[i].parent = node;
    fn(node.arguments[i], 'Expression');
    delete node.arguments[i].parent;
  }
};

exports.MemberExpression = function(node, fn) {
  node.object.parent = node;
  fn(node.object, 'Expression');
  delete node.object.parent;

  if (node.computed) {
    node.property.parent = node;
    fn(node.property, 'Expression');
    delete node.property.parent;
  }
};

/**
 * Utilities
 */

function skip(node, fn) {
  fn(node, false);
}

function ignore(node, fn) {}
