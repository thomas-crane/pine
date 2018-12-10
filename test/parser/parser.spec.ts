import { expect } from 'chai';
import 'mocha';
import { makeNodes } from '../../lib/make-nodes';
import { BinaryOp } from '../../src/ast/expr/binary-op';
import { Expression } from '../../src/ast/expression';
import { Statement } from '../../src/ast/statement';
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
      expect(program.lines[0]).instanceof(Expression);
    });
    it('should parse statements.', () => {
      const parser = new Parser(STMT_SAMPLE);
      const program = parser.program();
      expect(program.lines.length).to.equal(1);
      expect(program.lines[0]).instanceof(Statement);
    });
  });
  describe('#expression()', () => {
    it('should return an Expression for expressions.', () => {
      const parser = new Parser(EXPR_SAMPLE);
      expect(parser.expression()).instanceof(Expression);
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
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('lhs');
      expect(node).has.ownProperty('rhs');
    });
    it('should return a BinaryOp for subtraction.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Sub, NodeType.Num]));
      const node = parser.sum();
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('lhs');
      expect(node).has.ownProperty('rhs');
    });
    it('should be left associative.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Num, NodeType.Add, NodeType.Num,
        NodeType.Sub, NodeType.Num,
      ]));
      const node = parser.sum();
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('lhs');
      expect(node).has.ownProperty('rhs');

      // check rhs
      expect((node as BinaryOp).lhs).instanceof(Expression);
      expect((node as BinaryOp).lhs).has.ownProperty('lhs');
      expect((node as BinaryOp).lhs).has.ownProperty('rhs');

      // check lhs
      expect((node as BinaryOp).rhs).does.not.have.ownProperty('lhs');
      expect((node as BinaryOp).rhs).does.not.have.ownProperty('rhs');
    });
  });
  describe('#term()', () => {
    it('should return a BinaryOp for multiplication.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Mul, NodeType.Num]));
      const node = parser.term();
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('lhs');
      expect(node).has.ownProperty('rhs');
    });
    it('should return a BinaryOp for division.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Div, NodeType.Num]));
      const node = parser.term();
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('lhs');
      expect(node).has.ownProperty('rhs');
    });
    it('should be left associative.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Num, NodeType.Mul, NodeType.Num,
        NodeType.Div, NodeType.Num,
      ]));
      const node = parser.term();
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('lhs');
      expect(node).has.ownProperty('rhs');

      // check rhs
      expect((node as BinaryOp).lhs).instanceof(Expression);
      expect((node as BinaryOp).lhs).has.ownProperty('lhs');
      expect((node as BinaryOp).lhs).has.ownProperty('rhs');

      // check lhs
      expect((node as BinaryOp).rhs).does.not.have.ownProperty('lhs');
      expect((node as BinaryOp).rhs).does.not.have.ownProperty('rhs');
    });
  });
  describe('#factor()', () => {
    it('should return a BinaryOp for exponents.', () => {
      const parser = new Parser(makeNodes([NodeType.Num, NodeType.Pow, NodeType.Num]));
      const node = parser.factor();
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('lhs');
      expect(node).has.ownProperty('rhs');
    });
    it('should be right associative.', () => {
      const parser = new Parser(makeNodes([
        NodeType.Num, NodeType.Pow, NodeType.Num,
        NodeType.Pow, NodeType.Num,
      ]));
      const node = parser.factor();
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('lhs');
      expect(node).has.ownProperty('rhs');

      // check rhs
      expect((node as BinaryOp).rhs).instanceof(Expression);
      expect((node as BinaryOp).rhs).has.ownProperty('lhs');
      expect((node as BinaryOp).rhs).has.ownProperty('rhs');

      // check lhs
      expect((node as BinaryOp).lhs).does.not.have.ownProperty('lhs');
      expect((node as BinaryOp).lhs).does.not.have.ownProperty('rhs');
    });
  });
  describe('#exponent()', () => {
    it('should return a UnaryOp for negations.', () => {
      const parser = new Parser(makeNodes([NodeType.Sub, NodeType.Num]));
      const node = parser.exponent();
      expect(node).instanceof(Expression);
      expect(node).has.ownProperty('operator');
      expect(node).has.ownProperty('operand');
    });
  });
  describe('#value()', () => {
    it('should return an expression for ids.', () => {
      const parser = new Parser(makeNodes([NodeType.Id]));
      const node = parser.value();
      expect(node).instanceof(Expression);
    });
    it('should return an expression for a string.', () => {
      const parser = new Parser(makeNodes([NodeType.Str]));
      const node = parser.value();
      expect(node).instanceof(Expression);
    });
    it('should return an expression for a string.', () => {
      const parser = new Parser(makeNodes([NodeType.Num]));
      const node = parser.value();
      expect(node).instanceof(Expression);
    });
  });
});
