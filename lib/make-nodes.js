const { Node } = require('../dist/models/node');

exports.makeNodes = function (nodeTypes) {
  return nodeTypes.map((type) => {
    return new Node(undefined, type);
  });
}

exports.makeValueNodes = function (nodes) {
  return nodes.map(({ type, value }) => {
    return new Node(undefined, type, value);
  })
}
