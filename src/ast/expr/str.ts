import { Expression } from '../expression';

export class Str extends Expression {
  constructor(public str: string) {
    super();
  }

  toString() {
    return this.str;
  }
}
