// import { NumberField } from "../../Fields/NumberField";
// import { NodeGroups } from "../../NodeGroup";
// import { SpawnNode } from "./SpawnNode";

// export class BurstSpawn extends SpawnNode {
// 	nodeGroup: NodeGroups = NodeGroups.Spawn;
// 	nodeFields: {
// 		amount: NumberField;
// 	};

// 	constructor() {
// 		super();

// 		this.nodeFields = {
// 			amount: new NumberField(10),
// 		};
// 	}

// 	GetValue = (): number => {
// 		return this.nodeFields.amount.GetValue() as number;
// 	};

// 	GetAutoGenerationCode(): string {
// 		return ``;
// 	}
// }
