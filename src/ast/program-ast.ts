import { Expression } from './expression';
import { Statement } from './statement';

export class ProgramAST {
  lines: Array<Expression | Statement>;
  constructor() {
    this.lines = [];
  }

  toString(): string {
    return [
      'Program',
      ...this.lines.map((line) => line.toString()),
    ].join('\n');
  }
}
