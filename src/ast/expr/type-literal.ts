import { Expression } from '../expression';
import { Id } from './id';

export class TypeLiteral extends Expression {
  constructor(public id: Id, public args: Map<Id, Expression>) {
    super();
  }

  toString() {
    return `Type literal: ${this.id.toString()} args: ${this.args}`;
  }
}
