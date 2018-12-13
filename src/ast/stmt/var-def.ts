import * as util from 'util';
import { Id } from '../expr/id';
import { Expression } from '../expression';
import { Statement } from '../statement';
import { Type } from './type';

export class VarDef extends Statement {
  constructor(public type: Type, public id: Id, public assignment?: Expression) {
    super();
  }

  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
