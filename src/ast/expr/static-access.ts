import { Expression } from '../expression';
import { Type } from '../stmt/type';
import { FnCall } from './fn-call';
import { Id } from './id';
import { Self } from './self';

export class StaticAccess extends Expression {
  constructor(public type: Type | Self, public member: Id | FnCall) {
    super();
  }

}
