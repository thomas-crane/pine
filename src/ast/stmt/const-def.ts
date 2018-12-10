import { Id } from '../expr/id';
import { Expression } from '../expression';
import { Statement } from '../statement';
import { TypeDef } from './type';

export class ConstDef extends Statement {
  constructor(public type: TypeDef, public id: Id, public assignment: Expression) {
    super();
  }

  toString() {
    return `Const id: ${this.id.toString()} type: "${this.type.toString()}" = ${this.assignment.toString()}`;
  }
}
