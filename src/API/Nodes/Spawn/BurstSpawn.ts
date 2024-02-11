import { INodeField } from "../../Fields/NodeField";
import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { Node } from "../Node";
import { NodeTypes } from "../NodeTypes";

export class BurstSpawn extends Node {
	nodeGroup: NodeGroups = NodeGroups.Spawn;
	nodeType: NodeTypes = NodeTypes.BurstSpawn;
	nodeFields: INodeField[] = [];

	constructor(id: number, amount: number) {
		super(id);
		this.nodeFields.push(new NumberField(amount));
	}

	fn = (): number => {
		return this.nodeFields[0].GetValue() as number;
	};
}
