import * as util from 'util';
import { Id } from '../expr/id';
import { Statement } from '../statement';

export class TypeDef extends Statement {
  constructor(public types: Id[], public type = Type.Normal) {
    super();
  }

  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}

export enum Type {
  Normal = 'Normal',
  Array = 'Array',
  Tuple = 'Tuple',
  Null = 'Null',
}
