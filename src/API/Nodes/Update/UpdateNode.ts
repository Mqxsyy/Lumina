import { Node } from "../Node";

export abstract class UpdateNode<T extends unknown[] = []> extends Node {
	abstract UpdateValue: (id: number, ...params: T) => unknown;
}
