import { BinaryOp } from '../ast/expr/binary-op';
import { Bool } from '../ast/expr/bool';
import { Else } from '../ast/expr/else';
import { FnCall } from '../ast/expr/fn-call';
import { Id } from '../ast/expr/id';
import { If } from '../ast/expr/if';
import { MemberAccess } from '../ast/expr/member-access';
import { Num } from '../ast/expr/num';
import { Self } from '../ast/expr/self';
import { StaticAccess } from '../ast/expr/static-access';
import { Str } from '../ast/expr/str';
import { TypeLiteral } from '../ast/expr/type-literal';
import { UnaryOp } from '../ast/expr/unary-op';
import { Expression } from '../ast/expression';
import { ProgramAST } from '../ast/program-ast';
import { Statement } from '../ast/statement';
import { BlockStatement } from '../ast/stmt/block-statement';
import { ClassDef } from '../ast/stmt/class-def';
import { ClassImpl } from '../ast/stmt/class-impl';
import { ConstDef } from '../ast/stmt/const-def';
import { FnDef } from '../ast/stmt/fn-def';
import { TraitImpl } from '../ast/stmt/trait-impl';
import { Type, TypeDef } from '../ast/stmt/type';
import { VarDef } from '../ast/stmt/var-def';
import { Node } from '../models/node';
import { NodeType } from '../models/node-type';

export class Parser {
  current: Node;
  idx: number;
  constructor(public nodes: Node[]) {
    this.current = nodes[0];
    this.idx = 1;
  }

  printLastTokens() {
    // tslint:disable-next-line:no-console
    console.log(this.nodes.slice(Math.max(0, this.idx - 5), this.idx));
  }

  consume(type: NodeType) {
    if (this.current.type !== type) {
      this.printLastTokens();
      throw new Error(`Expected ${type}, got ${this.current.type}`);
    }
    this.current = this.nodes[this.idx++];
  }

  peek(n = 1) {
    return this.nodes
      .slice(this.idx, Math.min(this.idx + n, this.nodes.length))
      .map((node) => node.type);
  }

  accept(...types: NodeType[]) {
    if (!this.current) {
      return false;
    }
    return types.indexOf(this.current.type) !== -1;
  }

  program(): ProgramAST {
    const program = new ProgramAST();
    while (true) {
      const stmt = this.statement();
      if (stmt) {
        program.lines.push(stmt);
      }
      const expr = this.expression();
      if (expr) {
        program.lines.push(expr);
      }
      if (!expr && !stmt) {
        return program;
      }
    }
  }

  expression(): Expression {
    if (this.accept(NodeType.Id)) {
      const peek = this.peek()[0];
      switch (peek) {
        case NodeType.LCurly: return this.typeLiteral();
        case NodeType.Id: return undefined;
      }
      return this.sum();
    }
    if (this.accept(NodeType.Num, NodeType.Str, NodeType.Self, NodeType.LParen, NodeType.True, NodeType.False)) {
      return this.sum();
    }
    if (this.accept(NodeType.If)) {
      return this.if();
    }
    // not an expression
    return undefined;
  }

  statement(): Statement {
    if (this.accept(NodeType.Type)) {
      if (this.peek()[0] === NodeType.Id) {
        const peek = this.peek(2)[1];
        switch (peek) {
          case NodeType.Pipe: return this.classDef();
          case NodeType.Is: return this.traitImpl();
          case NodeType.Has: return this.classImpl();
        }
      }
    }
    if (this.accept(NodeType.Fn)) {
      return this.fnDef();
    }
    if (this.accept(NodeType.LCurly)) {
      return this.blockStatement();
    }
    if (this.accept(NodeType.Const)) {
      return this.constDef();
    }
    if (this.accept(NodeType.Id)) {
      if (this.peek()[0] === NodeType.Id) {
        return this.varDef();
      }
    }
    return undefined;
  }

  //#region statements
  classDef(): ClassDef {
    this.consume(NodeType.Type);
    const id = this.id();
    const classDef = new ClassDef(id, []);
    while (!this.accept(NodeType.Semi)) {
      this.consume(NodeType.Pipe);
      classDef.fields.push(this.varDef());
    }
    this.consume(NodeType.Semi);
    return classDef;
  }

  classImpl(): ClassImpl {
    this.consume(NodeType.Type);
    const id = this.id();
    const impl = new ClassImpl(id, []);
    this.consume(NodeType.Has);
    this.consume(NodeType.LCurly);
    while (!this.accept(NodeType.RCurly)) {
      impl.fns.push(this.fnDef());
    }
    this.consume(NodeType.RCurly);
    return impl;
  }

  traitImpl(): TraitImpl {
    this.consume(NodeType.Type);
    const id = this.id();
    const impl = new TraitImpl(id, []);
    this.consume(NodeType.Is);
    this.consume(NodeType.LCurly);
    while (!this.accept(NodeType.RCurly)) {
      impl.fns.push(this.fnDef());
    }
    this.consume(NodeType.RCurly);
    return impl;
  }

  fnDef(): FnDef {
    this.consume(NodeType.Fn);
    const id = this.id();
    let isStatic = true;
    const args: VarDef[] = [];
    this.consume(NodeType.LParen);
    if (this.accept(NodeType.Self)) {
      this.consume(NodeType.Self);
      isStatic = false;
      if (this.accept(NodeType.Comma)) {
        this.consume(NodeType.Comma);
      }
    }
    while (!this.accept(NodeType.RParen)) {
      args.push(this.varDef());
      if (this.accept(NodeType.Comma)) {
        this.consume(NodeType.Comma);
      }
    }
    this.consume(NodeType.RParen);
    let returnType: TypeDef = new TypeDef([], Type.Null);
    if (this.accept(NodeType.Return)) {
      this.consume(NodeType.Return);
      returnType = this.type();
    }
    const body = this.blockStatement();
    return new FnDef(id, isStatic, args, body, returnType);
  }

  type(): TypeDef {
    if (this.accept(NodeType.Id)) {
      const id = this.id();
      return new TypeDef([id]);
    }
    if (this.accept(NodeType.LSquare)) {
      this.consume(NodeType.LSquare);
      const type = this.type();
      const typeDef = new TypeDef(type.types, Type.Array);
      this.consume(NodeType.RSquare);
      return typeDef;
    }
    if (this.accept(NodeType.LParen)) {
      this.consume(NodeType.LParen);
      const typeDef = new TypeDef([], Type.Tuple);
      typeDef.types.push(this.id());
      while (this.accept(NodeType.Comma)) {
        this.consume(NodeType.Comma);
        typeDef.types.push(this.id());
      }
      this.consume(NodeType.RParen);
      return typeDef;
    }
    this.printLastTokens();
    throw new Error(`Cannot create type from ${this.current.type}`);
  }

  varDef(): VarDef {
    const type = this.type();
    const id = this.id();
    let assignment: Expression;
    if (this.accept(NodeType.Assign)) {
      this.consume(NodeType.Assign);
      assignment = this.expression();
    }
    return new VarDef(type, id, assignment);
  }

  constDef(): ConstDef {
    this.consume(NodeType.Const);
    const type = this.type();
    const id = this.id();
    this.consume(NodeType.Assign);
    const assignment = this.expression();
    return new ConstDef(type, id, assignment);
  }

  blockStatement(): BlockStatement {
    this.consume(NodeType.LCurly);
    const block = new BlockStatement([]);
    while (true) {
      const expr = this.expression();
      if (expr) {
        block.lines.push(expr);
      }
      const stmt = this.statement();
      if (stmt) {
        block.lines.push(stmt);
      }
      if (!expr && !stmt) {
        this.consume(NodeType.RCurly);
        return block;
      }
    }
  }
  //#endregion

  //#region expressions
  id(): Id {
    const val = this.current.value as string;
    this.consume(NodeType.Id);
    return new Id(val);
  }

  fnCall(): FnCall {
    const id = this.id();
    this.consume(NodeType.LParen);
    const fnCall = new FnCall(id, []);
    while (!this.accept(NodeType.RParen)) {
      const expr = this.expression();
      if (!expr) {
        this.printLastTokens();
        throw new Error(`Undefined expression in fn call arg.`);
      }
      fnCall.args.push(expr);
      if (this.accept(NodeType.Comma)) {
        this.consume(NodeType.Comma);
      }
    }
    this.consume(NodeType.RParen);
    return fnCall;
  }

  if(): If {
    this.consume(NodeType.If);
    const condition = this.expression();
    const body = this.blockStatement();
    let elsePart: Else;
    if (this.accept(NodeType.Else)) {
      elsePart = this.elsePart();
    }
    return new If(condition, body, elsePart);
  }

  elsePart(): Else {
    this.consume(NodeType.Else);
    if (this.accept(NodeType.If)) {
      return this.if();
    } else {
      const body = this.blockStatement();
      return new Else(body);
    }
  }

  typeLiteral(): TypeLiteral {
    const id = this.id();
    const typeLiteral = new TypeLiteral(id, new Map());
    this.consume(NodeType.LCurly);
    while (!this.accept(NodeType.RCurly)) {
      const id = this.id();
      this.consume(NodeType.Assign);
      const expr = this.expression();
      this.consume(NodeType.Comma);
      typeLiteral.args.set(id, expr);
    }
    this.consume(NodeType.RCurly);
    return typeLiteral;
  }

  memberAccess(): MemberAccess {
    let id: Id | Self;
    if (this.accept(NodeType.Self)) {
      id = this.self();
    } else {
      id = this.id();
    }
    let val: Expression;
    this.consume(NodeType.Colon);
    if (this.peek()[0] === NodeType.LParen) {
      val = this.fnCall();
    } else {
      val = this.id();
    }
    return new MemberAccess(id, val as (Id | FnCall));
  }

  staticAccess(): StaticAccess {
    let id: Id | Self;
    if (this.accept(NodeType.Self)) {
      id = this.self();
    } else {
      id = this.id();
    }
    let val: Expression;
    this.consume(NodeType.DoubleColon);
    if (this.peek()[0] === NodeType.LParen) {
      val = this.fnCall();
    } else {
      val = this.id();
    }
    return new StaticAccess(id, val as (Id | FnCall));
  }

  self(): Self {
    this.consume(NodeType.Self);
    return new Self();
  }

  bool(): Bool {
    if (this.accept(NodeType.True)) {
      this.consume(NodeType.True);
      return new Bool(true);
    } else {
      this.consume(NodeType.False);
      return new Bool(false);
    }
  }
  //#endregion

  //#region sum
  sum(): Expression {
    let sum = this.term();
    while (this.accept(NodeType.Add, NodeType.Sub)) {
      const op = this.current.type;
      this.consume(this.current.type);
      const rhs = this.term();
      sum = new BinaryOp(sum, op, rhs);
    }
    return sum;
  }

  term(): Expression {
    let term = this.comparison();
    while (this.accept(NodeType.Mul, NodeType.Div, NodeType.Mod)) {
      const op = this.current.type;
      this.consume(this.current.type);
      const rhs = this.comparison();
      term = new BinaryOp(term, op, rhs);
    }
    return term;
  }

  comparison(): Expression {
    let comparison = this.equality();
    while (this.accept(NodeType.LessThan, NodeType.LessOrEqual, NodeType.GreaterThan, NodeType.GreaterOrEqual)) {
      const op = this.current.type;
      this.consume(this.current.type);
      const rhs = this.equality();
      comparison = new BinaryOp(comparison, op, rhs);
    }
    return comparison;
  }

  equality(): Expression {
    let equality = this.factor();
    while (this.accept(NodeType.Equal, NodeType.NotEqual)) {
      const op = this.current.type;
      this.consume(this.current.type);
      const rhs = this.factor();
      equality = new BinaryOp(equality, op, rhs);
    }
    return equality;
  }

  factor(): Expression {
    const exponent = this.exponent();
    if (this.accept(NodeType.Pow)) {
      this.consume(NodeType.Pow);
      const rhs = this.factor();
      return new BinaryOp(exponent, NodeType.Pow, rhs);
    }
    return exponent;
  }

  exponent(): Expression {
    if (this.accept(NodeType.Sub)) {
      this.consume(NodeType.Sub);
      const val = this.exponent();
      return new UnaryOp(NodeType.Sub, val);
    }
    return this.value();
  }

  value(): Expression {
    if (this.accept(NodeType.True, NodeType.False)) {
      return this.bool();
    }
    if (this.accept(NodeType.LParen)) {
      this.consume(NodeType.LParen);
      const expr = this.expression();
      this.consume(NodeType.RParen);
      return expr;
    }
    if (this.accept(NodeType.Self)) {
      const peek = this.peek()[0];
      switch (peek) {
        case NodeType.Colon: return this.memberAccess();
        case NodeType.DoubleColon: return this.staticAccess();
        default: return this.self();
      }
    }
    if (this.accept(NodeType.Num)) {
      const num = this.current.value as number;
      this.consume(NodeType.Num);
      return new Num(num);
    }
    if (this.accept(NodeType.Id)) {
      const peek = this.peek()[0];
      switch (peek) {
        case NodeType.LParen: return this.fnCall();
        case NodeType.Colon: return this.memberAccess();
        case NodeType.DoubleColon: return this.staticAccess();
        default: return this.id();
      }
    }
    if (this.accept(NodeType.Str)) {
      const str = this.current.value as string;
      this.consume(NodeType.Str);
      return new Str(str);
    }
    this.printLastTokens();
    throw new Error(`Cannot create value from ${this.current.type}`);
  }
  //#endregion
}
