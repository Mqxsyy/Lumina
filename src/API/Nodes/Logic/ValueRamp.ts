import { Vector2Field } from "API/Fields/Vector2Field";
import { NodeGroups } from "API/NodeGroup";
import { LogicNode } from "./LogicNode";
import { NumberField } from "API/Fields/NumberField";

export class ValueRamp extends LogicNode<number> {
	nodeGroup: NodeGroups = NodeGroups.Logic;
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

	Calculate = () => {
		const range = this.nodeFields.range.GetValue();
		return range.X + (range.Y - range.X) * this.nodeFields.value.GetValue();
	};

	GetAutoGenerationCode() {
		return ``;
	}
}
