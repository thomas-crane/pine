import * as util from 'util';
import { AST } from './ast';
export abstract class Expression extends AST {
  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
