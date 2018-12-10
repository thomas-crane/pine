import { Expression } from '../expression';

export class Num extends Expression {
  constructor(public num: number) {
    super();
  }

  toString() {
    return this.num.toString();
  }
}
