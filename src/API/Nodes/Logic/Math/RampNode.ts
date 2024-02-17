import { Vector2Field } from "API/Fields/Vector2Field";
import { NodeGroups } from "API/NodeGroup";
import { NodeTypes } from "API/Nodes/NodeTypes";
import { LogicNode } from "../LogicNode";
import { NumberField } from "API/Fields/NumberField";

export class RampNode extends LogicNode {
	nodeGroup: NodeGroups = NodeGroups.Logic;
	nodeType: NodeTypes = NodeTypes.Ramp;
	nodeFields: {
		value: NumberField;
		range: Vector2Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			value: new NumberField(0),
			range: new Vector2Field(new Vector2(0, 1)),
		};
	}

	Calculate = (): number => {
		const range = this.nodeFields.range.GetValue();
		return range.X + (range.Y - range.X) * this.nodeFields.value.GetValue();
	};
}
