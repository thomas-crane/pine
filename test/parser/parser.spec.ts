import { expect } from 'chai';
import 'mocha';
import { makeNodes } from '../../lib/make-nodes';
import { BinaryOp } from '../../src/ast/expr/binary-op';
import { Id } from '../../src/ast/expr/id';
import { Num } from '../../src/ast/expr/num';
import { Str } from '../../src/ast/expr/str';
import { UnaryOp } from '../../src/ast/expr/unary-op';
import { Statement } from '../../src/ast/statement';
import { ArrayType } from '../../src/ast/stmt/array-type';
import { BlockStatement } from '../../src/ast/stmt/block-statement';
import { ClassDef } from '../../src/ast/stmt/class-def';
import { ClassImpl } from '../../src/ast/stmt/class-impl';
import { ConstDef } from '../../src/ast/stmt/const-def';
import { FnDef } from '../../src/ast/stmt/fn-def';
import { TraitImpl } from '../../src/ast/stmt/trait-impl';
import { Type } from '../../src/ast/stmt/type';
import { VarDef } from '../../src/ast/stmt/var-def';
import { NodeType } from '../../src/models/node-type';
import { Parser } from '../../src/parser/parser';

const STMT_SAMPLE = makeNodes([
  NodeType.Type, NodeType.Id,
  NodeType.Pipe, NodeType.Id, NodeType.Id,
  NodeType.Pipe, NodeType.Id, NodeType.Id,
  NodeType.Pipe, NodeType.Id, NodeType.Id,
  NodeType.Semi,
  NodeType.EOF,
]);

const EXPR_SAMPLE = makeNodes([
  NodeType.Num, NodeType.Div,
  NodeType.LParen, NodeType.Num, NodeType.Add,
  NodeType.Num, NodeType.RParen,
]);

describe('Parser', () => {
  describe('#consume()', () => {
    it('should advance the current node if the type matches.', () => {
      const parser = new Parser(makeNodes([NodeType.Id, NodeType.Assign]));
      parser.consume(NodeType.Id);
      expect(parser.current.type).to.equal(NodeType.Assign);
    });
    it('should throw an error if the types do not match.', () => {
      const parser = new Parser(makeNodes([NodeType.Id, NodeType.Assign]));
      expect(() => parser.consume(NodeType.Not)).to.throw();
    });
  });
  describe('#peek()', () => {
    it('should return the next n node types.', () => {
      const parser = new Parser(EXPR_SAMPLE);
      expect(parser.peek(3)).to.deep.equal([
        NodeType.Div,
        NodeType.LParen, NodeType.Num,
      ]);
    });
    it('should not go past the end of the array.', () => {
      const parser = new Parser(EXPR_SAMPLE);
      expect(parser.peek(EXPR_SAMPLE.length + 10))
        .to.deep.equal(EXPR_SAMPLE.slice(1).map((expr) => expr.type));
    });
  });
  describe('#accept()', () => {
    const parser = new Parser(STMT_SAMPLE);
    it('should return true if the next node types match the arguments.', () => {
      expect(parser.accept(NodeType.Type, NodeType.Id)).to.equal(true);
    });
    it('should be false if the next node types don\'t match the arguments.', () => {
      expect(parser.accept(NodeType.Pipe, NodeType.Id)).to.equal(false);
    });
  });
  describe('#program()', () => {
    it('should parse expressions.', () => {
      const parser = new Parser(EXPR_SAMPLE);
      const program = parser.program();
      expect(program.lines.length).to.equal(1);
      expect(program.lines[0] instanceof BinaryOp).to.equal(true);
    });
    it('should parse statements.', () => {
      const parser = new Parser(STMT_SAMPLE);
      const program = parser.program();
      expect(program.lines.length).to.equal(1);
      expect(program.lines[0] instanceof ClassDef).to.equal(true);
    });
  });
  describe('#expression()', () => {
    it('should return an Expression for expressions.', () => {
      const parser = new Parser(EXPR_SAMPLE);
      expect(parser.expression() instanceof BinaryOp).to.equal(true);
    });
    it('should return undefined for statements.', () => {
      const parser = new Parser(STMT_SAMPLE);
      expect(parser.expression()).to.equal(undefined);
    });
  });
  describe('#statement()', () => {
    it('should return a Statement for statements.', () => {
      const parser = new Parser(STMT_SAMPLE);
      expect(parser.statement()).instanceof(Statement);
    });
    it('should return undefined for expressions.', () => {
      const parser = new Parser(EXPR_SAMPLE);
      expect(parser.statement()).to.equal(undefined);
    });
  });
  describe('#classDef()', () => {
    it('should return a ClassDef for class definitions.', () => {
      const parser = new Parser(STMT_SAMPLE);
      const classDef = parser.classDef();
      expect(classDef instanceof ClassDef).to.equal(true);
    });
  });
  describe('#classImpl', () => {
    it('should return a ClassImpl for class implementations.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Type, NodeType.Id, NodeType.Has, NodeType.LCurly,
        NodeType.RCurly,
      ]));
      const classImpl = parser.classImpl();
      expect(classImpl instanceof ClassImpl).to.equal(true);
    });
  });
  describe('#traitImpl()', () => {
    it('should return a ClassImpl for class implementations.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Type, NodeType.Id, NodeType.Is, NodeType.Id, NodeType.LCurly,
        NodeType.RCurly,
      ]));
      const traitImpl = parser.traitImpl();
      expect(traitImpl instanceof TraitImpl).to.equal(true);
    });
  });
  describe('#fnDef()', () => {
    it('should return an FnDef for function definitions.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Fn, NodeType.Id, NodeType.LParen, NodeType.Id, NodeType.Id, NodeType.RParen, NodeType.LCurly,
        NodeType.RCurly,
      ]));
      const fnDef = parser.fnDef();
      expect(fnDef instanceof FnDef).to.equal(true);
    });
  });
  describe('#type()', () => {
    it('should return a Type for ids.', () => {
      const parser = new Parser(makeNodes([NodeType.Id]));
      const type = parser.type();
      expect(type instanceof Type).to.equal(true);
    });
    it('should return an ArrayType for array types.', () => {
      const parser = new Parser(makeNodes([NodeType.LSquare, NodeType.Id, NodeType.RSquare]));
      const type = parser.type();
      expect(type instanceof ArrayType).to.equal(true);
    });
  });
  describe('#varDef()', () => {
    it('should return a VarDef for var defs.', () => {
      const parser = new Parser(makeNodes([NodeType.Id, NodeType.Id]));
      const varDef = parser.varDef();
      expect(varDef instanceof VarDef).to.equal(true);
    });
    it('should recognize assignments.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Id, NodeType.Id,
        NodeType.Assign, NodeType.Num, NodeType.Add, NodeType.Num,
      ]));
      const varDef = parser.varDef();
      expect(varDef instanceof VarDef).to.equal(true);
      expect((varDef as VarDef).assignment).to.not.equal(undefined);
    });
  });
  describe('#constDef()', () => {
    it('should return a ConstDef for const defs.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Const, NodeType.Id, NodeType.Id,
        NodeType.Assign, NodeType.Num, NodeType.Add, NodeType.Num,
      ]));
      const constDef = parser.constDef();
      expect(constDef instanceof ConstDef).to.equal(true);
    });
    it('should throw if there is no assignment.', () => {
      const parser = new Parser(makeNodes([NodeType.Const, NodeType.Id, NodeType.Id]));
      expect(() => parser.constDef()).to.throw();
    });
  });
  describe('#blockStatement()', () => {
    it('should recognize empty blocks.', () => {
      const parser = new Parser(makeNodes([NodeType.LCurly, NodeType.RCurly]));
      const blockStatement = parser.blockStatement();
      expect(blockStatement instanceof BlockStatement).to.equal(true);
      expect((blockStatement as BlockStatement).lines.length).to.equal(0);
    });
    it('should recognize blocks with one statement.', () => {
      const parser = new Parser(makeNodes([
        NodeType.LCurly,
        NodeType.Num, NodeType.Add, NodeType.Num,
        NodeType.RCurly,
      ]));
      const blockStatement = parser.blockStatement();
      expect(blockStatement instanceof BlockStatement).to.equal(true);
      expect((blockStatement as BlockStatement).lines.length).to.equal(1);
    });
    it('should recognize blocks with two statement.', () => {
      const parser = new Parser(makeNodes([
        NodeType.LCurly,
        NodeType.Num, NodeType.Add, NodeType.Num, NodeType.Semi,
        NodeType.Num, NodeType.Mul, NodeType.Num,
        NodeType.RCurly,
      ]));
      const blockStatement = parser.blockStatement();
      expect(blockStatement instanceof BlockStatement).to.equal(true);
      expect((blockStatement as BlockStatement).lines.length).to.equal(2);
    });
  });
  describe('#sum()', () => {
    it('should return a BinaryOp for addition.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Add, NodeType.Num]));
      const node = parser.sum();
      expect(node instanceof BinaryOp).to.equal(true);
    });
    it('should return a BinaryOp for subtraction.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Sub, NodeType.Num]));
      const node = parser.sum();
      expect(node instanceof BinaryOp).to.equal(true);
    });
    it('should be left associative.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Num, NodeType.Add, NodeType.Num,
        NodeType.Sub, NodeType.Num,
      ]));
      const node = parser.sum();
      expect(node instanceof BinaryOp).to.equal(true);
      // check rhs
      expect((node as BinaryOp).rhs instanceof BinaryOp).to.equal(false);
      // check lhs
      expect((node as BinaryOp).lhs instanceof BinaryOp).to.equal(true);
    });
  });
  describe('#term()', () => {
    it('should return a BinaryOp for multiplication.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Mul, NodeType.Num]));
      const node = parser.term();
      expect(node instanceof BinaryOp).to.equal(true);
    });
    it('should return a BinaryOp for division.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Div, NodeType.Num]));
      const node = parser.term();
      expect(node instanceof BinaryOp).to.equal(true);
    });
    it('should be left associative.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Num, NodeType.Mul, NodeType.Num,
        NodeType.Div, NodeType.Num,
      ]));
      const node = parser.term();
      expect(node instanceof BinaryOp).to.equal(true);
      // check rhs
      expect((node as BinaryOp).lhs instanceof BinaryOp).to.equal(true);
      // check lhs
      expect((node as BinaryOp).rhs instanceof BinaryOp).to.equal(false);
    });
  });
  describe('#factor()', () => {
    it('should return a BinaryOp for exponents.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Pow, NodeType.Num]));
      const node = parser.factor();
      expect(node instanceof BinaryOp).to.equal(true);
    });
    it('should be right associative.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Num, NodeType.Pow, NodeType.Num,
        NodeType.Pow, NodeType.Num,
      ]));
      const node = parser.factor();
      expect(node instanceof BinaryOp).to.equal(true);
      // check rhs
      expect((node as BinaryOp).rhs instanceof BinaryOp).to.equal(true);
      // check lhs
      expect((node as BinaryOp).lhs instanceof BinaryOp).to.equal(false);
    });
  });
  describe('#exponent()', () => {
    it('should return a UnaryOp for negations.', () => {
      const parser = new Parser(makeNodes([NodeType.Sub, NodeType.Num]));
      const node = parser.exponent();
      expect(node instanceof UnaryOp).to.equal(true);
    });
  });
  describe('#value()', () => {
    it('should return an Id for ids.', () => {
      const parser = new Parser(makeNodes([NodeType.Id]));
      const node = parser.value();
      expect(node instanceof Id).to.equal(true);
    });
    it('should return a Str for a string.', () => {
      const parser = new Parser(makeNodes([NodeType.Str]));
      const node = parser.value();
      expect(node instanceof Str).to.equal(true);
    });
    it('should return a Num for a number.', () => {
      const parser = new Parser(makeNodes([NodeType.Num]));
      const node = parser.value();
      expect(node instanceof Num).to.equal(true);
    });
  });
});
