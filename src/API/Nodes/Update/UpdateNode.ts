import { Node } from "../Node";

export abstract class UpdateNode extends Node {
	abstract Update(id: number): void;
}
