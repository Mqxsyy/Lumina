import { NumberField } from "API/Fields/NumberField";
import { NodeGroups } from "API/NodeGroup";
import { SpawnNode } from "./SpawnNode";
import { AutoGenConstantSpawn } from "../AutoGeneration/SpawnNodes/AutoGenConstantSpawn";

export class ConstantSpawn extends SpawnNode {
	nodeGroup: NodeGroups = NodeGroups.Spawn;
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

	GetAutoGenerationCode() {
		return AutoGenConstantSpawn(this);
	}
}
