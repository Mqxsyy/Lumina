import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { Node } from "../Node";
import { NodeTypes } from "../NodeTypes";

export class BurstSpawn extends Node {
	nodeGroup: NodeGroups = NodeGroups.Spawn;
	nodeType: NodeTypes = NodeTypes.BurstSpawn;
	nodeFields: {
		amount: NumberField;
	};

	constructor(id: number) {
		super(id);

		this.nodeFields = {
			amount: new NumberField(),
		};
	}

	fn = (): number => {
		return this.nodeFields.amount.GetValue() as number;
	};
}
