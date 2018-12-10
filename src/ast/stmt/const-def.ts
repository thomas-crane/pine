import * as util from 'util';
import { Id } from '../expr/id';
import { Expression } from '../expression';
import { Statement } from '../statement';
import { TypeDef } from './type';

export class ConstDef extends Statement {
  constructor(public type: TypeDef, public id: Id, public assignment: Expression) {
    super();
  }

  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
