import * as util from 'util';
import { Expression } from '../expression';
import { Id } from './id';

export class FnCall extends Expression {
  constructor(public id: Id, public args: Expression[]) {
    super();
  }

  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
