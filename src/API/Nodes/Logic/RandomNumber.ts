import { Vector2Field } from "API/Fields/Vector2Field";
import { NodeGroups } from "API/NodeGroup";
import { LogicNode } from "./LogicNode";
import { BooleanField } from "API/Fields/BooleanField";
import { Rand } from "API/Lib";
import { AutoGenRandomNumber } from "API/Nodes/AutoGeneration/LogicNodes/AutoGenRandomNumber";

export class RandomNumber extends LogicNode<number> {
	nodeGroup: NodeGroups = NodeGroups.Logic;
	nodeFields: {
		range: Vector2Field;
		isInt: BooleanField;
		randomizeOnce: BooleanField;
	};

	constructor() {
		super();

		this.nodeFields = {
			range: new Vector2Field(new Vector2(1, 10)),
			isInt: new BooleanField(false),
			randomizeOnce: new BooleanField(false),
		};
	}

	Calculate = () => {
		const range = this.nodeFields.range.GetValue();
		let value = range.X + Rand.NextNumber() * (range.Y - range.X);

		if (this.nodeFields.isInt.GetValue()) {
			value = math.round(value);
		}

		return value;
	};

	GetAutoGenerationCode(wrapper: string) {
		return AutoGenRandomNumber(this, wrapper);
	}
}
