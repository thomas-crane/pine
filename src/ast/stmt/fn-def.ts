import { Id } from '../expr/id';
import { Statement } from '../statement';
import { BlockStatement } from './block-statement';
import { Type } from './type';
import { VarDef } from './var-def';

export class FnDef extends Statement {
  constructor(
    public id: Id,
    public isStatic: boolean,
    public args: VarDef[],
    public body: BlockStatement,
    public returnType: Type,
  ) {
    super();
  }

}
