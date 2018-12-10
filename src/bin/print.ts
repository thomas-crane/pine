import * as fs from 'fs';
import * as path from 'path';
import { ProgramAST } from '../ast/program-ast';
import { Lexer } from '../lexer/lexer';
import { Parser } from '../parser/parser';

export function print(file: string): ProgramAST {
  const filename = path.join(process.cwd(), file);
  const contents = fs.readFileSync(filename, { encoding: 'utf8' });
  const nodes = new Lexer(contents).allTokens();
  const parser = new Parser(nodes);
  return parser.program();
}
