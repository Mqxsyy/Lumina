import { Node } from "../Node";

export abstract class LogicNode extends Node {
	abstract Calculate: () => unknown;
}
