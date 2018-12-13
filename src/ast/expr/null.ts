import * as util from 'util';
import { Expression } from '../expression';

export class Null extends Expression {
  constructor() {
    super();
  }

  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
