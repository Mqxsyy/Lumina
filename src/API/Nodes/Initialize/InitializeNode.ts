import { Node } from "../Node";

export abstract class InitializeNode extends Node {
	abstract GetValue: () => unknown;
}