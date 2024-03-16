import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenLifetime } from "../AutoGeneration/InitializeNodes/AutoGenLifetime";
import { NodeTypes } from "../NodeTypes";
import { InitializeNode } from "./InitializeNode";

export class Lifetime extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeType: NodeTypes = NodeTypes.Lifetime;
	nodeFields: {
		time: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			time: new NumberField(1),
		};
	}

	GetValue = (): number => {
		return this.nodeFields.time.GetValue() as number;
	};

	GetAutoGenerationCode() {
		return AutoGenLifetime(this);
	}
}
