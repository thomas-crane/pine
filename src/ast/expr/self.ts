import { Expression } from '../expression';

export class Self extends Expression {

  constructor() {
    super();
  }
  toString(): string {
    return `self`;
  }
}
