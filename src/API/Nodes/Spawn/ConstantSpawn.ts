import { NumberField } from "API/Fields/NumberField";
import { NodeGroups } from "API/NodeGroup";
import { NodeTypes } from "API/Nodes/NodeTypes";
import { SpawnNode } from "./SpawnNode";

export class ConstantSpawnNode extends SpawnNode {
	nodeGroup: NodeGroups = NodeGroups.Spawn;
	nodeType: NodeTypes = NodeTypes.ConstantSpawn;
	nodeFields: {
		rate: NumberField; // per second
	};

	constructor() {
		super();

		this.nodeFields = {
			rate: new NumberField(20),
		};
	}

	GetValue = (): number => {
		return this.nodeFields.rate.GetValue() as number;
	};
}
