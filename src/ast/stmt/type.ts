import { Id } from '../expr/id';
import { Statement } from '../statement';

export class TypeDef extends Statement {
  constructor(public types: Id[], public type = Type.Normal) {
    super();
  }

  toString() {
    const types = this.types.map((t) => t.toString()).join(', ');
    switch (this.type) {
      case Type.Normal: return `${types}`;
      case Type.Tuple: return `(${types})`;
      case Type.Array: return `[${types}]`;
      case Type.Self: return `self`;
      case Type.Null: return `null`;
    }
  }
}

export enum Type {
  Normal,
  Array,
  Tuple,
  Self,
  Null,
}
