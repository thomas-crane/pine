import { expect } from 'chai';
import 'mocha';
import { Id } from '../../src/ast/expr/id';
import { FnDef } from '../../src/ast/stmt/fn-def';
import { Type } from '../../src/ast/stmt/type';
import { VarDef } from '../../src/ast/stmt/var-def';
import { ScopeLevel } from '../../src/scope/scope-level';

const var1 = new VarDef(
  new Type(new Id('num')),
  new Id('someVar'),
);
const var2 = new VarDef(
  new Type(new Id('str')),
  new Id('anotherVar'),
);
const fn1 = new FnDef(
  new Id('someFn'),
  false,
  [var1, var2],
  undefined,
  undefined,
);

describe('ScopeLevel', () => {
  describe('#setVar()', () => {
    it('should add an item to the scope level.', () => {
      const scope = new ScopeLevel('root');
      expect(scope.hasVar(var1.id)).to.equal(false);
      scope.setVar(var1);
      expect(scope.hasVar(var1.id)).to.equal(true);
    });
  });
  describe('#setFn()', () => {
    it('should add an item to the scope level.', () => {
      const scope = new ScopeLevel('root');
      expect(scope.hasFn(fn1.id)).to.equal(false);
      scope.setFn(fn1);
      expect(scope.hasFn(fn1.id)).to.equal(true);
    });
  });
  describe('#hasVar()', () => {
    it('should return true if the scope level has the specified var.', () => {
      const scope = new ScopeLevel('root');
      scope.setVar(var1);
      expect(scope.hasVar(var1.id)).to.equal(true);
    });
    it('should return false if the var does not exist in this scope level.', () => {
      const scope = new ScopeLevel('root');
      expect(scope.hasVar(var1.id)).to.equal(false);
    });
  });

  describe('#hasFn()', () => {
    it('should return true if the scope level has the specified fn.', () => {
      const scope = new ScopeLevel('root');
      scope.setFn(fn1);
      expect(scope.hasFn(fn1.id)).to.equal(true);
    });
    it('should return false if the fn does not exist in this scope level.', () => {
      const scope = new ScopeLevel('root');
      expect(scope.hasFn(fn1.id)).to.equal(false);
    });
  });
});
