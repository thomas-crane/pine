import * as util from 'util';
import { Id } from '../expr/id';
import { Type } from './type';

export class LetType extends Type {
  constructor() {
    super(new Id('let'));
  }

  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
