# Pine

[![Build Status](https://travis-ci.org/thomas-crane/pine.svg?branch=master)](https://travis-ci.org/thomas-crane/pine)


Pine is a general purpose language which is heavily inspired by Rust.
Pine compiles to Node.js style JavaScript.

## Contents

+ [Foreword](#foreword)
+ [Install](#install)
  + [From GitHub](#from-github)
+ [The CLI](#the-cli)
  + [`print <filename>`](#print-filename)
  + [`compile <filename>`](#compile-filename)
+ [Syntax and examples](#syntax-and-examples)
  + [Variables and if statements](#variables-and-if-statements)
  + [Functions](#functions)
  + [Custom types](#custom-types)
+ [Building](#building)
+ [Testing and contributing](#testing-and-contributing)

## Foreword

This project is still in early development. Many features may be buggy or not yet implemented.

## Install

### From GitHub

```bash
git clone https://github.com/thomas-crane/pine.git
cd pine
npm link
```

## The CLI

There are several CLI commands available which can be used to compile and inspect Pine code.

The current supported arguments are

### `print <filename>`

Prints the AST representation of the Pine code in the given file.

### `compile <filename>`

Compiles the given Pine file to JavaScript. **This is not yet implemented.**

## Syntax and examples

These examples are also available in the `examples/` directory.
A full description of the [grammar in EBNF form](/docs/grammar.ebnf) is available in the `docs/` directory.

### Variables and if statements

```pine
num x = 20;
str test;

if x > 15 {
  test = 'x > 15';
} else if x < 10 {
  test = 'x < 10';
} else {
  test = '15 > x > 10';
}
```

If statements can also be used as expressions, so the following code is equivalent

```pine
str test = if x > 15 {
  'x > 15'
} else if x < 10 {
  'x < 10'
} else {
  '15 > x > 15'
}
```

### Functions

```pine
fn fib(num n) -> num {
  if n <= 1 {
    1
  } else {
    fib(n - 1) + fib(n - 2)
  }
}

fib(10);
```

### Custom types

```pine
# A type which represents a coordinate on a grid.
type Point
  | num x
  | num y
  ;

# Methods which are available on Point type.
type Point has {

  # Static method.
  fn new(num x, num y) -> Point {
    Point {
      x = x,
      y = y,
    }
  }

  # Instance method.
  fn scale(self, num factor) -> Point {
    Point::new(self:x * factor, self:y * factor)
  }
}
```

## Building

If you want to create a custom fork of the Pine compiler, you will need to rebuild the project when you make changes. The `package.json` has 3 scripts which are used for building.

+ `npm run clean` - deletes the build directory (`dist/`)
+ `npm run compile` - compiles the TypeScript.
+ `npm run build` - Runs `clean`, then `compile`.

Most of the time, `build` is the script that you want to run. If it is your first time building however, `compile` will be a bit faster.

## Testing and contributing

If you wish to contribute to the Pine compiler, feel free to create a pull request. When contributing, it is important to contribute tested code. To run existing tests, use the command

```bash
npm test
```

This will run the unit tests located in the `test/` dir.

When adding a feature, make sure the new feature has tests. Even if some of them do not pass.

There is an additional npm command which can be run to ensure your code follows the project's style guidelines.

```bash
npm run lint
```

This command run tslint. You should make sure this passes, as pull requests that do not pass this command will be rejected.
