import * as util from 'util';
import { Expression } from './expression';
import { Statement } from './statement';

export class ProgramAST {
  lines: Array<Expression | Statement>;
  constructor() {
    this.lines = [];
  }

  toString(): string {
    return util.inspect(this, false, Infinity, true);
  }
}
