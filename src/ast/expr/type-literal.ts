import { Expression } from '../expression';
import { Type } from '../stmt/type';
import { Id } from './id';

export class TypeLiteral extends Expression {
  constructor(public type: Type, public args: Map<Id, Expression>) {
    super();
  }

}
