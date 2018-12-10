export abstract class Expression {
  abstract toString(): string;
}

export enum ExprType {
  Id,
  Literal,
  FnCall,
  Sum,
  If,
}
