import * as util from 'util';
import { Type } from './type';

export class ArrayType extends Type {
  constructor(public type: Type) {
    super(type.id);
  }

  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
