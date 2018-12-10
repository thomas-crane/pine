import { Expression } from '../expression';
import { FnCall } from './fn-call';
import { Id } from './id';

export class StaticAccess extends Expression {
  constructor(public type: Id, public member: Id | FnCall) {
    super();
  }

  toString() {
    return `Static access ${this.type.toString()}::${this.member.toString()}`;
  }
}
