import * as util from 'util';
import { Expression } from '../expression';
import { FnCall } from './fn-call';
import { Id } from './id';
import { Self } from './self';

export class StaticAccess extends Expression {
  constructor(public type: Id | Self, public member: Id | FnCall) {
    super();
  }

  toString() {
    return util.inspect(this, false, 10, true);
  }
}
