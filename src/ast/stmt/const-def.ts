import { Id } from '../expr/id';
import { Expression } from '../expression';
import { Statement } from '../statement';
import { Type } from './type';

export class ConstDef extends Statement {
  constructor(public type: Type, public id: Id, public assignment: Expression) {
    super();
  }
}
