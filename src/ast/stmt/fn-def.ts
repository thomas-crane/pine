import { Id } from '../expr/id';
import { Statement } from '../statement';
import { BlockStatement } from './block-statement';
import { TypeDef } from './type';
import { VarDef } from './var-def';

export class FnDef extends Statement {
  constructor(
    public id: Id,
    public isStatic: boolean,
    public args: VarDef[],
    public body: BlockStatement,
    public returnType: TypeDef,
  ) {
    super();
  }

  toString() {
    const args = this.args.map((a) => a.toString()).join(', ');
    return `Fn ${this.isStatic ? 'static' : ''} ${this.id.toString()}(${args})\nbody => ${this.body.toString()}`;
  }
}
