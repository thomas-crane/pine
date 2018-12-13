import { Id } from '../ast/expr/id';
import { ConstDef } from '../ast/stmt/const-def';
import { FnDef } from '../ast/stmt/fn-def';
import { VarDef } from '../ast/stmt/var-def';

export class ScopeLevel {
  varDefs: Map<string, VarDef | ConstDef>;
  fnDefs: Map<string, FnDef>;
  constructor(readonly name: string) {
    this.varDefs = new Map();
    this.fnDefs = new Map();
  }

  /**
   * Stores a var in this scope.
   * @param varDef The var to store.
   */
  setVar(varDef: VarDef | ConstDef) {
    this.varDefs.set(varDef.id.id, varDef);
  }

  /**
   * Stores a fn in this scope.
   * @param fnDef The fn to store.
   */
  setFn(fnDef: FnDef) {
    this.fnDefs.set(fnDef.id.id, fnDef);
  }

  /**
   * Checks whether or not a var with the given id
   * exists in this scope or any parent of this scope.
   * @param item The id to check.
   */
  hasVar(item: Id): boolean {
    return this.varDefs.has(item.id);
  }

  /**
   * Checks whether or not a fn with the given id
   * exists in this scope or any parent of this scope.
   * @param item The id to check.
   */
  hasFn(item: Id): boolean {
    return this.fnDefs.has(item.id);
  }
}
