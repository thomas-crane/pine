import { Id } from '../ast/expr/id';
import { ConstDef } from '../ast/stmt/const-def';
import { FnDef } from '../ast/stmt/fn-def';
import { VarDef } from '../ast/stmt/var-def';
import { ScopeLevel } from './scope-level';

export class Scope {
  levels: ScopeLevel[];
  private levelPtr: number;
  constructor(public name: string) {
    this.levels = [new ScopeLevel(name)];
    this.levelPtr = 0;
  }

  /**
   * Stores a var in this scope.
   * @param varDef The var to store.
   */
  setVar(varDef: VarDef | ConstDef) {
    this.levels[this.levelPtr].setVar(varDef);
  }

  /**
   * Stores a fn in this scope.
   * @param fnDef The fn to store.
   */
  setFn(fnDef: FnDef) {
    this.levels[this.levelPtr].setFn(fnDef);
  }

  /**
   * Checks whether or not a var with the given id
   * exists in this scope or any parent of this scope.
   * @param item The id to check.
   */
  hasVar(item: Id): boolean {
    for (let i = this.levelPtr; i >= 0; i--) {
      if (this.levels[i].hasVar(item)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks whether or not a fn with the given id
   * exists in this scope or any parent of this scope.
   * @param item The id to check.
   */
  hasFn(item: Id): boolean {
    for (let i = this.levelPtr; i >= 0; i--) {
      if (this.levels[i].hasFn(item)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks whether or not a var with
   * the given id exists in the top scope level.
   * @param item The id to check.
   */
  hasImmediateVar(item: Id): boolean {
    return this.levels[this.levelPtr].hasVar(item);
  }

  /**
   * Checks whether or not a fn with
   * the given id exists in the top scope level.
   * @param item The id to check.
   */
  hasImmediateFn(item: Id): boolean {
    return this.levels[this.levelPtr].hasFn(item);
  }

  /**
   * Creates a new scope level and returns it.
   * @param name The name for the new level.
   */
  child(name: string): ScopeLevel {
    this.levelPtr++;
    this.levels[this.levelPtr] = new ScopeLevel(name);
    return this.levels[this.levelPtr];
  }
}
