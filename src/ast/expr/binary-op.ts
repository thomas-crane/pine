import { NodeType } from '../../models/node-type';
import { Expression } from '../expression';

export class BinaryOp extends Expression {
  constructor(public lhs: Expression, public op: NodeType, public rhs: Expression) {
    super();
  }

  toString() {
    return `BinOp\nlhs: ${this.lhs.toString()}\nop: ${this.op}\nrhs: ${this.rhs.toString()}`;
  }
}
