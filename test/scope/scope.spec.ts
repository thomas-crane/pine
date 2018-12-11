import { expect } from 'chai';
import 'mocha';
import { Id } from '../../src/ast/expr/id';
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
    it ('should return false if the var does not exist in the scope chain.', () => {
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
});
