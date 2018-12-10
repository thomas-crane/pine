import { Expression } from '../expression';

export class Bool extends Expression {
  constructor(public value: boolean) {
    super();
  }

  toString() {
    return this.value ? 'true' : 'false';
  }
}
