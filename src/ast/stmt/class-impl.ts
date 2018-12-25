import { Id } from '../expr/id';
import { Statement } from '../statement';
import { FnDef } from './fn-def';

export class ClassImpl extends Statement {
  constructor(public id: Id, public fns: FnDef[]) {
    super();
  }

}
