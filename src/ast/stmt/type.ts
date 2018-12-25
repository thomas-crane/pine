import { Id } from '../expr/id';
import { Statement } from '../statement';

export class Type extends Statement {
  constructor(public id: Id) {
    super();
  }
}
