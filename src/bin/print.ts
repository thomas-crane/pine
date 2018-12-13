import * as fs from 'fs';
import * as path from 'path';
import { Lexer } from '../lexer/lexer';
import { Parser } from '../parser/parser';

export function print(file: string) {
  const filename = path.join(process.cwd(), file);
  const contents = fs.readFileSync(filename, { encoding: 'utf8' });
  const nodes = new Lexer(contents).allTokens();
  const parser = new Parser(nodes);
  const program = parser.program();
  // tslint:disable-next-line:no-console
  console.log(program.toString());
}
