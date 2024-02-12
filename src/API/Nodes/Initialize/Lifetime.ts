import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { Node } from "../Node";
import { NodeTypes } from "../NodeTypes";

export class Lifetime extends Node {
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

	fn = (): number => {
		return this.nodeFields.time.GetValue() as number;
	};
}
