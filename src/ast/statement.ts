export abstract class Statement {
  abstract toString(): string;
}

export enum StmtType {
  ClassDef,
  ClassImpl,
  TraitImpl,
  FnDef,
  VarDef,
  ConstDef,
  BlockStatement,
}
