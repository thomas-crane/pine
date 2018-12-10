export enum NodeType {
  // literals and ids.
  Id = 'Id',
  Str = 'String',
  Num = 'Num',
  Quotemark = 'Quotemark',

  // single tokens
  Semi = 'Semi',
  Comma = 'Comma',
  Pipe = 'Pipe',
  Colon = 'Colon',
  DoubleColon = 'DoubleColon',

  // flow control
  If = 'If',
  Else = 'Else',
  While = 'While',
  For = 'For',

  // functions
  Return = 'Return',
  Fn = 'Fn',

  // var decls
  Const = 'Const',

  // custom types
  Type = 'Type',
  Has = 'Has',
  Is = 'Is',
  As = 'as',

  // others
  From = 'From',
  Self = 'Self',

  // arithmetic operators
  Add = 'Add',
  Sub = 'Sub',
  Mul = 'Mul',
  Div = 'Div',
  Mod = 'Mod',
  Pow = 'Pow',

  // comparison operators
  GreaterThan = 'GreaterThan',
  GreaterOrEqual = 'GreaterOrEqual',
  LessThan = 'LessThan',
  LessOrEqual = 'LessOrEqual',
  Equal = 'Equal',

  // assignment
  Assign = 'Assign',
  AddAssign = 'AddAssign',
  SubAssign = 'SubAssign',
  MulAssign = 'MulAssign',
  DivAssign = 'DivAssign',
  ModAssign = 'ModAssign',
  PreIncr = 'PreIncr',
  PostIncr = 'PostIncr',
  PreDecr = 'PreDecr',
  PostDecr = 'PostDecr',

  // Parenthesis
  LParen = 'LParen',
  RParen = 'RParen',
  LCurly = 'LCurly',
  RCurly = 'RCurly',
  LSquare = 'LSquare',
  RSquare = 'RSquare',

  // special
  EOF = 'EOF',
  Unknown = 'Unknown',
  Error = 'Error',
}
