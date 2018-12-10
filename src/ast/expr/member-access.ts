import * as util from 'util';
import { Expression } from '../expression';
import { FnCall } from './fn-call';
import { Id } from './id';
import { Self } from './self';

export class MemberAccess extends Expression {
  constructor(public id: Id | Self, public member: Id | FnCall) {
    super();
  }

  toString() {
    return util.inspect(this, false, 10, true);
  }
}
