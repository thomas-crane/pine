import { expect } from 'chai';
import 'mocha';
import { Id } from '../../src/ast/expr/id';
import { FnDef } from '../../src/ast/stmt/fn-def';
import { Type } from '../../src/ast/stmt/type';
import { VarDef } from '../../src/ast/stmt/var-def';
import { Scope } from '../../src/scope/scope';

describe('Scope', () => {
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

  describe('#hasImmediateVar()', () => {
    it('should return true if the scope has the specified var.', () => {
      const scope = new Scope('root');
      scope.setVar(var1);
      expect(scope.hasImmediateVar(var1.id)).to.equal(true);
    });
    it('should return false if the specified var exists in a parent of this scope.', () => {
      const root = new Scope('first');
      root.setVar(var1);
      root.child('second');

      expect(root.hasImmediateVar(var1.id)).to.equal(false);
    });
  });

  describe('#hasImmediateFn()', () => {
    it('should return true if the scope has the specified fn.', () => {
      const scope = new Scope('root');
      scope.setFn(fn1);
      expect(scope.hasImmediateFn(fn1.id)).to.equal(true);
    });
    it('should return false if the specified fn exists in a parent of this scope.', () => {
      const root = new Scope('first');
      root.setFn(fn1);
      root.child('second');

      expect(root.hasImmediateFn(fn1.id)).to.equal(false);
    });
  });
});
