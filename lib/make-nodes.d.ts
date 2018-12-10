import { Node } from '../src/models/node';
import { NodeType } from '../src/models/node-type';

export function makeNodes(nodeTypes: NodeType[]): Node[];
export function makeValueNodes(nodes: Array<{ type: NodeType, value?: string | number }>): Node[];
