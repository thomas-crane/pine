import { NodeType } from '../../models/node-type';
import { Expression } from '../expression';

export class UnaryOp extends Expression {
  constructor(public operator: NodeType, public operand: Expression) {
    super();
  }

}
