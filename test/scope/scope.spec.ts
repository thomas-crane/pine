import { expect } from 'chai';
import 'mocha';
import { Id } from '../../src/ast/expr/id';
import { FnDef } from '../../src/ast/stmt/fn-def';
import { Type, TypeDef } from '../../src/ast/stmt/type';
import { VarDef } from '../../src/ast/stmt/var-def';
import { Scope } from '../../src/scope/scope';

describe('Scope', () => {
  const var1 = new VarDef(
    new TypeDef([new Id('num')], Type.Normal),
    new Id('someVar'),
  );
  const var2 = new VarDef(
    new TypeDef([new Id('str')], Type.Normal),
    new Id('anotherVar'),
  );
  const var3 = new VarDef(
    new TypeDef([new Id('num')], Type.Array),
    new Id('myArray'),
  );
  const fn1 = new FnDef(
    new Id('someFn'),
    false,
    [var1, var2],
    undefined,
    undefined,
  );
  const fn2 = new FnDef(
    new Id('otherFn'),
    false,
    [var3],
    undefined,
    undefined,
  );
  const fn3 = new FnDef(
    new Id('pureFn'),
    false,
    [],
    undefined,
    new TypeDef([], Type.Null),
  );
  describe('#setVar()', () => {
    it('should add an item to the scope.', () => {
      const scope = new Scope('root');
      expect(scope.hasVar(var1.id)).to.equal(false);
      scope.setVar(var1);
      expect(scope.hasVar(var1.id)).to.equal(true);
    });
    it('should not affect parent scopes.', () => {
      const scope = new Scope('root');
      const child = scope.child('child');
      expect(scope.hasVar(var1.id)).to.equal(false);
      child.setVar(var1);
      expect(scope.hasVar(var1.id)).to.equal(false);
    });
  });
  describe('#setFn()', () => {
    it('should add an item to the scope.', () => {
      const scope = new Scope('root');
      expect(scope.hasFn(fn1.id)).to.equal(false);
      scope.setFn(fn1);
      expect(scope.hasFn(fn1.id)).to.equal(true);
    });
    it('should not affect parent scopes.', () => {
      const scope = new Scope('root');
      const child = scope.child('child');
      expect(scope.hasFn(fn1.id)).to.equal(false);
      child.hasFn(fn1.id);
      expect(scope.hasFn(fn1.id)).to.equal(false);
    });
  });
  describe('#hasVar()', () => {
    it('should return true if the scope has the specified var.', () => {
      const scope = new Scope('root');
      scope.setVar(var1);
      expect(scope.hasVar(var1.id)).to.equal(true);
    });
    it('should return true if any of the parent scopes have the specified var.', () => {
      const first = new Scope('first');
      const second = first.child('second');
      const third = second.child('third');
      first.setVar(var1);
      second.setVar(var2);
      third.setVar(var3);

      expect(third.hasVar(var1.id)).to.equal(true);
      expect(third.hasVar(var2.id)).to.equal(true);
    });
    it('should return false if the var does not exist in the scope chain.', () => {
      const first = new Scope('first');
      const second = first.child('second');
      const third = second.child('third');

      expect(third.hasVar(var1.id)).to.equal(false);
    });
    it('should return false if the var does exist in a child, but not in any parents.', () => {
      const first = new Scope('first');
      const second = first.child('second');

      second.setVar(var1);
      expect(first.hasVar(var1.id)).to.equal(false);
    });
  });

  describe('#hasFn()', () => {
    it('should return true if the scope has the specified fn.', () => {
      const scope = new Scope('root');
      scope.setFn(fn1);
      expect(scope.hasFn(fn1.id)).to.equal(true);
    });
    it('should return true if any of the parent scopes have the specified fn.', () => {
      const first = new Scope('first');
      const second = first.child('second');
      const third = second.child('third');
      first.setFn(fn1);
      second.setFn(fn2);
      third.setFn(fn3);

      expect(third.hasFn(fn1.id)).to.equal(true);
      expect(third.hasFn(fn2.id)).to.equal(true);
    });
    it('should return false if the fn does not exist in the scope chain.', () => {
      const first = new Scope('first');
      const second = first.child('second');
      const third = second.child('third');

      expect(third.hasFn(fn1.id)).to.equal(false);
    });
    it('should return false if the fn does exist in a child, but not in any parents.', () => {
      const first = new Scope('first');
      const second = first.child('second');

      second.setFn(fn1);
      expect(first.hasFn(fn1.id)).to.equal(false);
    });
  });

  describe('#hasImmediateVar()', () => {
    it('should return true if the scope has the specified var.', () => {
      const scope = new Scope('root');
      scope.setVar(var1);
      expect(scope.hasImmediateVar(var1.id)).to.equal(true);
    });
    it('should return false if the specified var exists in a parent of this scope.', () => {
      const first = new Scope('first');
      const second = first.child('second');

      first.setVar(var1);
      expect(second.hasImmediateVar(var1.id)).to.equal(false);
    });
  });

  describe('#hasImmediateFn()', () => {
    it('should return true if the scope has the specified fn.', () => {
      const scope = new Scope('root');
      scope.setFn(fn1);
      expect(scope.hasImmediateFn(fn1.id)).to.equal(true);
    });
    it('should return false if the specified fn exists in a parent of this scope.', () => {
      const first = new Scope('first');
      const second = first.child('second');

      first.setFn(fn1);
      expect(second.hasImmediateFn(fn1.id)).to.equal(false);
    });
  });
});
