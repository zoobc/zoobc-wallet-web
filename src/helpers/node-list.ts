export interface NodeList {
  node: Node[];
  timestamp: number;
}

export interface Node {
  ip: string;
  name: string;
  default: boolean;
}
