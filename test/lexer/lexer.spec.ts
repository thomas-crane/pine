import { expect } from 'chai';
import 'mocha';
import { Lexer } from '../../src/lexer/lexer';
import { NodeType } from '../../src/models/node-type';

const EXAMPLE_STR = 'num x = 32;';
const EXAMPLE_STR_NODES = [
  NodeType.Id,
  NodeType.Id,
  NodeType.Assign,
  NodeType.Num,
  NodeType.Semi,
  NodeType.EOF,
];

describe('Lexer', () => {
  describe('#nextToken()', () => {
    it('should recognize single numbers.', () => {
      const lexer = new Lexer('1');
      const node = lexer.nextNode();
      expect(node.type).to.equal(NodeType.Num);
      expect(node.value).to.equal(1);
    });
    it('should recognize numbers.', () => {
      const lexer = new Lexer('1432');
      const node = lexer.nextNode();
      expect(node.type).to.equal(NodeType.Num);
      expect(node.value).to.equal(1432);
    });
    it('should recognize ids.', () => {
      const lexer = new Lexer('hello');
      const node = lexer.nextNode();
      expect(node.type).to.equal(NodeType.Id);
      expect(node.value).to.equal('hello');
    });
    it('should recognize keywords.', () => {
      const lexer = new Lexer('type');
      const node = lexer.nextNode();
      expect(node.type).to.equal(NodeType.Type);
      expect(node.value).to.equal(undefined);
    });
    it('should recognize strings.', () => {
      const lexer = new Lexer('\'test string\'');
      const node = lexer.nextNode();
      expect(node.type).to.equal(NodeType.Str);
      expect(node.value).to.equal('test string');
    });
    it('should recognize strings with escaped quotes.', () => {
      const lexer = new Lexer('\'test\\\'string\'');
      const node = lexer.nextNode();
      expect(node.type).to.equal(NodeType.Str);
      expect(node.value).to.equal('test\'string');
    });
    it('should recognize strings with escape codes.', () => {
      const lexer = new Lexer('\'test\\tstring\'');
      const node = lexer.nextNode();
      expect(node.type).to.equal(NodeType.Str);
      expect(node.value).to.equal('test\\tstring');
    });
    it('should skip comments.', () => {
      const lexer = new Lexer('# this is a comment\n10');
      const node = lexer.nextNode();
      expect(node.type).to.equal(NodeType.Num);
    });
  });
  describe('#next()', () => {
    it('should return the correct number of nodes', () => {
      const lexer = new Lexer(EXAMPLE_STR);
      const nodes = lexer.next(3).map((node) => node.type);
      expect(nodes).to.deep.equal([NodeType.Id, NodeType.Id, NodeType.Assign]);
    });
    it('should return if an EOF is reached.', () => {
      const lexer = new Lexer(EXAMPLE_STR);
      const nodes = lexer.next(50).map((node) => node.type);
      expect(nodes).to.deep.equal(EXAMPLE_STR_NODES);
    });
  });
  describe('#until()', () => {
    it('should return all nodes until the specified type is encountered.', () => {
      const lexer = new Lexer(EXAMPLE_STR);
      const nodes = lexer.until(NodeType.Num).map((node) => node.type);
      expect(nodes).to.deep.equal([NodeType.Id, NodeType.Id, NodeType.Assign, NodeType.Num]);
    });
    it('should return if an EOF is reached.', () => {
      const lexer = new Lexer(EXAMPLE_STR);
      const nodes = lexer.until(NodeType.If).map((node) => node.type);
      expect(nodes).to.deep.equal(EXAMPLE_STR_NODES);
    });
  });
  describe('#allTokens()', () => {
    it('should create nodes until the EOF is reached.', () => {
      const testText = `
      type Test is
        | num x
        | num y
        | str test
        ;`;
      const lexer = new Lexer(testText);
      const nodeTypes = lexer.allTokens().map((node) => node.type);
      expect(nodeTypes).to.deep.equal([
        NodeType.Type, NodeType.Id, NodeType.Is,
          NodeType.Pipe, NodeType.Id, NodeType.Id,
          NodeType.Pipe, NodeType.Id, NodeType.Id,
          NodeType.Pipe, NodeType.Id, NodeType.Id,
          NodeType.Semi,
          NodeType.EOF,
      ]);
    });
  });
});
