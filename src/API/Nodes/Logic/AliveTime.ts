import { NodeGroups } from "API/NodeGroup";
import { NodeTypes } from "API/Nodes/NodeTypes";
import { NumberField } from "API/Fields/NumberField";
import { LogicNode } from "./LogicNode";

export class AliveTime extends LogicNode {
	nodeGroup: NodeGroups = NodeGroups.Logic;
	nodeType: NodeTypes = NodeTypes.AliveTime;
	nodeFields: {
		value: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			value: new NumberField(0),
		};
	}

	Calculate = (): number => {
		return this.nodeFields.value.GetValue();
	};
}