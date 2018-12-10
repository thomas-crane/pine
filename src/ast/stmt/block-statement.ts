import { Expression } from '../expression';
import { Statement } from '../statement';

export class BlockStatement extends Statement {
  constructor(public lines: Array<Expression | Statement>) {
    super();
  }

  toString() {
    return `Block:\n${this.lines.map((l) => `  ${l.toString()}\n`)}`;
  }
}
