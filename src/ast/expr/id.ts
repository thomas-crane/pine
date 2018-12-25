import { Expression } from '../expression';

export class Id extends Expression {
  constructor(public id: string) {
    super();
  }
}
