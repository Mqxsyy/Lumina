import { Node } from "../Node";

export abstract class LogicNode<T = undefined> extends Node {
	abstract Calculate: () => T;
}
