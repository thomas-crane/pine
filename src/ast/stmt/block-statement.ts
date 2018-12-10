import * as util from 'util';
import { Expression } from '../expression';
import { Statement } from '../statement';

export class BlockStatement extends Statement {
  constructor(public lines: Array<Expression | Statement>) {
    super();
  }

  toString() {
    return util.inspect(this, false, 10, true);
  }
}
