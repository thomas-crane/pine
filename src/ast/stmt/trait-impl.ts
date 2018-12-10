import * as util from 'util';
import { Id } from '../expr/id';
import { Statement } from '../statement';
import { FnDef } from './fn-def';

export class TraitImpl extends Statement {
  constructor(public id: Id, public fns: FnDef[]) {
    super();
  }

  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
