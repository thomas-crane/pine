import { Expression } from '../expression';
import { BlockStatement } from '../stmt/block-statement';
import { Else } from './else';

export class If extends Expression {
  constructor(public condition: Expression, public body: BlockStatement, public elsePart: Else | If) {
    super();
  }

}
