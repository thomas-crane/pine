import * as util from 'util';
import { Expression } from '../expression';
import { Id } from './id';

export class TypeLiteral extends Expression {
  constructor(public id: Id, public args: Map<Id, Expression>) {
    super();
  }

  toString() {
    return util.inspect(this, false, 10, true);
  }
}
