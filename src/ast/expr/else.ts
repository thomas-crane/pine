import * as util from 'util';
import { Expression } from '../expression';
import { BlockStatement } from '../stmt/block-statement';

export class Else extends Expression {
  constructor(public body: BlockStatement) {
    super();
  }

  toString() {
    return util.inspect(this, false, 10, true);
  }
}
