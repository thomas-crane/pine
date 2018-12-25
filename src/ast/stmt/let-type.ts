import { Id } from '../expr/id';
import { Type } from './type';

export class LetType extends Type {
  constructor() {
    super(new Id('let'));
  }

}
