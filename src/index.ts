// import { makeValueNodes } from '../lib/make-nodes';
import * as fs from 'fs';
import * as path from 'path';
import { Lexer } from './lexer/lexer';
import { Parser } from './parser/parser';

const filename = path.join(process.cwd(), process.argv.slice(2)[0]);
const contents = fs.readFileSync(filename, { encoding: 'utf8' });
const nodes = new Lexer(contents).allTokens();

const program = new Parser(nodes).program();

console.log(program.toString());
