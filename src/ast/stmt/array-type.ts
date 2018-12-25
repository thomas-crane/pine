import { Type } from './type';

export class ArrayType extends Type {
  constructor(public type: Type) {
    super(type.id);
  }

}
