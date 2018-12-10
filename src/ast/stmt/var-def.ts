import { Id } from '../expr/id';
import { Expression } from '../expression';
import { Statement } from '../statement';
import { TypeDef } from './type';

export class VarDef extends Statement {
  constructor(public type: TypeDef, public id: Id, public assignment?: Expression) {
    super();
  }

  toString() {
    return `Var ${this.id.toString()} type: "${this.type.toString()}"`;
  }
}
