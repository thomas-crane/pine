import { Node } from '../models/node';
import { Cursor } from '../models/node-pos';
import { NodeType } from '../models/node-type';
import * as chars from '../util/chars';

const OP_CHARS = [
  '+', // add
  '-', // sub
  '*', // mul
  '/', // div
  '%', // mod
  '<', // less than
  '>', // greater than
  '=', // assign
  '!', // not
];

const SINGLE_CHARS = [
  ';',
  ',',
  ':',
  '|',
];

const NEXT_OP_CHARS = [
  '*', // ** is pow
  '=', // assignment/equality
  '>', // -> is fn return type
];

export class Lexer {
  pos: Cursor;
  src: string;
  idx: number;
  chr: string;

  constructor(source: string) {
    this.src = source;
    this.idx = 1;
    this.chr = this.src[0];
    this.pos = new Cursor(1, 1);
  }

  advance() {
    if (this.chr === '\n') {
      this.pos.ln++;
      this.pos.col = 1;
    } else {
      this.pos.col++;
    }
    this.chr = this.src[this.idx++];
  }

  allTokens(): Node[] {
    return this.until(NodeType.EOF);
  }

  until(type: NodeType): Node[] {
    const nodes: Node[] = [];
    let node: Node;
    do {
      node = this.nextNode();
      nodes.push(node);
      if (node.type === NodeType.EOF) {
        return nodes;
      }
    } while (node.type !== type);
    return nodes;
  }

  next(n: number): Node[] {
    if (n <= 0) {
      return [];
    }
    const nodes: Node[] = [];
    for (let i = 0; i < n; i++) {
      const node = this.nextNode();
      nodes.push(node);
      if (node.type === NodeType.EOF) {
        return nodes;
      }
    }
    return nodes;
  }

  nextNode(): Node {
    // skip whitespace
    while (chars.isSpace(this.chr)) {
      this.advance();
    }

    // eof
    if (this.idx > this.src.length) {
      return new Node(this.pos.pos(), NodeType.EOF);
    }

    // numbers
    if (chars.isNum(this.chr)) {
      const pos = this.pos.pos();
      const num = this.getNumber();
      return new Node(pos, NodeType.Num, num);
    }

    // strings
    if (this.chr === '\'') {
      const pos = this.pos.pos();
      let buf = '';
      let hasError = false;
      this.advance();
      while (this.chr !== '\'') {
        if (this.chr === '\\') {
          this.advance();
          if (this.chr !== '\'') {
            buf += '\\';
          }
          if (['\'', 'n', 't'].indexOf(this.chr) === -1) {
            // invalid escape sequence
            hasError = true;
          }
          buf += this.chr;
        } else {
          buf += this.chr;
        }
        this.advance();
      }
      let type = NodeType.Str;
      if (hasError) {
        type = NodeType.Error;
      }
      return new Node(pos, type, buf);
    }

    // parenthesis
    if (chars.isParen(this.chr)) {
      const paren = this.getParen();
      const pos = this.pos.pos();
      this.advance();
      return new Node(pos, paren);
    }

    // operators
    if (OP_CHARS.indexOf(this.chr) !== -1) {
      const start = this.pos.pos();
      let buf = this.chr;
      this.advance();
      if (NEXT_OP_CHARS.indexOf(this.chr) !== -1) {
        buf += this.chr;
        this.advance();
      }
      const type = this.getOp(buf);
      return new Node(start, type);
    }

    // ids
    if (chars.isIdHead(this.chr)) {
      const start = this.pos.pos();
      let buf = this.chr;
      this.advance();
      while (chars.isIdBody(this.chr)) {
        buf += this.chr;
        this.advance();
      }
      const type = this.getKeyword(buf);
      let value: string;
      if (type === NodeType.Id) {
        value = buf;
      }
      return new Node(start, type, value);
    }

    // single chars
    if (SINGLE_CHARS.indexOf(this.chr) !== -1) {
      const start = this.pos.pos();
      let buf = this.chr;
      this.advance();
      if (this.chr === ':') {
        buf += this.chr;
        this.advance();
      }
      const type = this.getMisc(buf);
      return new Node(start, type);
    }

    // unknown char.
    const start = this.pos.pos();
    const val = this.chr;
    this.advance();
    return new Node(start, NodeType.Unknown, val);
  }

  private getMisc(buf: string): NodeType {
    switch (buf) {
      case ';': return NodeType.Semi;
      case ',': return NodeType.Comma;
      case ':': return NodeType.Colon;
      case '::': return NodeType.DoubleColon;
      case '|': return NodeType.Pipe;
      default: return NodeType.Unknown;
    }
  }

  private getKeyword(buf: string): NodeType {
    switch (buf) {
      case 'if': return NodeType.If;
      case 'else': return NodeType.Else;
      case 'for': return NodeType.For;
      case 'while': return NodeType.While;
      case 'return': return NodeType.Return;
      case 'is': return NodeType.Is;
      case 'fn': return NodeType.Fn;
      case 'has': return NodeType.Has;
      case 'self': return NodeType.Self;
      case 'true': return NodeType.True;
      case 'type': return NodeType.Type;
      case 'false': return NodeType.False;
      case 'const': return NodeType.Const;
      default: return NodeType.Id;
    }
  }

  private getOp(buf: string): NodeType {
    switch (buf) {
      case '+': return NodeType.Add;
      case '-': return NodeType.Sub;
      case '*': return NodeType.Mul;
      case '/': return NodeType.Div;
      case '%': return NodeType.Mod;
      case '<': return NodeType.LessThan;
      case '>': return NodeType.GreaterThan;
      case '=': return NodeType.Assign;
      case '!': return NodeType.Not;
      case '->': return NodeType.Return;
      case '+=': return NodeType.AddAssign;
      case '-=': return NodeType.SubAssign;
      case '*=': return NodeType.MulAssign;
      case '/=': return NodeType.DivAssign;
      case '%=': return NodeType.ModAssign;
      case '<=': return NodeType.LessOrEqual;
      case '>=': return NodeType.GreaterOrEqual;
      case '==': return NodeType.Equal;
      case '!=': return NodeType.NotEqual;
      default: return NodeType.Unknown;
    }
  }

  private getParen(): NodeType {
    switch (this.chr) {
      case '(': return NodeType.LParen;
      case ')': return NodeType.RParen;
      case '{': return NodeType.LCurly;
      case '}': return NodeType.RCurly;
      case '[': return NodeType.LSquare;
      case ']': return NodeType.RSquare;
      default: throw new Error('getParen has no match');
    }
  }

  private getNumber(): number {
    let buf = '';
    while (chars.isNum(this.chr)) {
      buf += this.chr;
      this.advance();
    }
    if (this.chr === '.') {
      buf += this.chr;
      this.advance();
      while (chars.isNum(this.chr)) {
        buf += this.chr;
        this.advance();
      }
    }

    if (isNaN(buf as any)) {
      throw new Error('getNumber isNaN was true');
    }
    return +buf;
  }
}
