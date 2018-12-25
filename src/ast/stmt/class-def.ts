import { Id } from '../expr/id';
import { Statement } from '../statement';
import { VarDef } from './var-def';

export class ClassDef extends Statement {
  constructor(public id: Id, public fields: VarDef[]) {
    super();
  }

}
