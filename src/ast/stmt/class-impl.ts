import { Id } from '../expr/id';
import { Statement } from '../statement';
import { FnDef } from './fn-def';

export class ClassImpl extends Statement {
  constructor(public id: Id, public fns: FnDef[]) {
    super();
  }

  toString() {
    const fns = this.fns.map((f) => `  ${f.toString()}\n`);
    return `Class Impl: ${this.id.toString()}\nFns:\n${fns}`;
  }
}
