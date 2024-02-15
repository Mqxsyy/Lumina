import { Node } from "../Node";

export abstract class SpawnNode extends Node {
	abstract GetValue: () => number;
}
