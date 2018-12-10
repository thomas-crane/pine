import { NodePos } from './node-pos';
import { NodeType } from './node-type';

export class Node {
  constructor(public pos: NodePos, public type: NodeType, public value?: number | string) { }
}
