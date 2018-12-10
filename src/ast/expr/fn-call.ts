import { Expression } from '../expression';
import { Id } from './id';

export class FnCall extends Expression {
  constructor(public id: Id, public args: Expression[]) {
    super();
  }

  toString() {
    return `FnCall: ${this.id.toString()}(${this.args.map((a) => a.toString()).join(', ')})`;
  }
}
