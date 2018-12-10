export interface NodePos {
  ln: number;
  col: number;
}

export class Cursor {
  constructor(public ln: number, public col: number) { }
  pos(): NodePos {
    return {
      ln: this.ln,
      col: this.col,
    };
  }

  toString(): string {
    return `Ln ${this.ln}, Col ${this.col}`;
  }
}
