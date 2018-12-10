import { expect } from 'chai';
import 'mocha';
import { makeNodes } from '../../lib/make-nodes';
import { BinaryOp } from '../../src/ast/expr/binary-op';
import { Id } from '../../src/ast/expr/id';
import { Num } from '../../src/ast/expr/num';
import { Str } from '../../src/ast/expr/str';
import { UnaryOp } from '../../src/ast/expr/unary-op';
import { Statement } from '../../src/ast/statement';
import { ClassDef } from '../../src/ast/stmt/class-def';
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
