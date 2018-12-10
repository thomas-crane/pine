import { Id } from '../expr/id';
import { Statement } from '../statement';
import { FnDef } from './fn-def';

export class TraitImpl extends Statement {
  constructor(public id: Id, public fns: FnDef[]) {
    super();
  }

  toString() {
    return `TraitImpl: ${this.id.toString()}\nFns: ${this.fns.map((fn) => fn.toString()).join('\n')}`;
  }
}
