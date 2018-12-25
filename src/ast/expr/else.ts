import { Expression } from '../expression';
import { BlockStatement } from '../stmt/block-statement';

export class Else extends Expression {
  constructor(public body: BlockStatement) {
    super();
  }

}
