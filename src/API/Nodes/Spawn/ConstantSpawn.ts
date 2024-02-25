import { NumberField } from "API/Fields/NumberField";
import { NodeGroups } from "API/NodeGroup";
import { NodeTypes } from "API/Nodes/NodeTypes";
import { CreateConstantSpawnNode } from "Components/Nodes/Spawn/ConstantSpawn";
import { SpawnNode } from "./SpawnNode";

export class ConstantSpawn extends SpawnNode {
	nodeGroup: NodeGroups = NodeGroups.Spawn;
	nodeType: NodeTypes = NodeTypes.ConstantSpawn;
	nodeFields: {
		rate: NumberField; // per second
	};
	nodeElement = () => CreateConstantSpawnNode(this.nodeFields.rate.SetValue);

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
