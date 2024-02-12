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

	constructor(id: number) {
		super(id);

		this.nodeFields = {
			time: new NumberField(),
		};
	}

	fn = (): number => {
		return this.nodeFields.time.GetValue() as number;
	};
}
