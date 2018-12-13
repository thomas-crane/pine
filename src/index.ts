#!/usr/bin/env node
import { print } from './bin/print';

const usage = [
  'Pine compiler',
  '',
  '  Usage:',
  '',
  '  print <filename>',
  '    - prints the AST of a Pine file.',
  '    - Usage: `pine print main.pine`',
  '',
  '  compile <filename>',
  '    - compiles the Pine file.',
  '    - Usage: `pine compile main.pine`',
].join('\n');

// tslint:disable:no-console
const cmd = process.argv.slice(2)[0];
switch (cmd) {
  case 'print':
    const file = process.argv.slice(2)[1];
    if (!file) {
      console.log('Please include a filename, e.g. "pine compile test.pine"');
      process.exit(0);
    }
    print(file);
    break;
  default:
    console.log(usage);
    process.exit(0);
    break;
}
