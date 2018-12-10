import { Expression } from '../expression';
import { FnCall } from './fn-call';
import { Id } from './id';

export class MemberAccess extends Expression {
  constructor(public id: Id, public member: Id | FnCall) {
    super();
  }

  toString() {
    return `Member access: ${this.id.toString()}:${this.member.toString()}`;
  }
}
