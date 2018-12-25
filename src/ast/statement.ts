import * as util from 'util';
import { AST } from './ast';
export abstract class Statement extends AST {
  toString() {
    return util.inspect(this, false, Infinity, true);
  }
}
