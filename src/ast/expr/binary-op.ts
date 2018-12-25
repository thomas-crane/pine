import { NodeType } from '../../models/node-type';
import { Expression } from '../expression';

export class BinaryOp extends Expression {
  constructor(public lhs: Expression, public op: NodeType, public rhs: Expression) {
    super();
  }

}
