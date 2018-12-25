import * as util from 'util';
export abstract class AST {
  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
