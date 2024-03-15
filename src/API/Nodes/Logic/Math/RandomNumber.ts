import { Vector2Field } from "API/Fields/Vector2Field";
import { NodeGroups } from "API/NodeGroup";
import { NodeTypes } from "API/Nodes/NodeTypes";
import { LogicNode } from "../LogicNode";
import { BooleanField } from "API/Fields/BooleanField";
import { Rand } from "API/Lib";

export class RandomNumber extends LogicNode {
	nodeGroup: NodeGroups = NodeGroups.Logic;
	nodeType: NodeTypes = NodeTypes.RandomNumber;
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

	Calculate = (): number => {
		const range = this.nodeFields.range.GetValue();
		let value = range.X + Rand.NextNumber() * (range.Y - range.X);

		if (this.nodeFields.isInt.GetValue()) {
			value = math.round(value);
		}

		return value;
	};

	GetAutoGenerationCode(wrapper?: string): string {
		const className = `RandomNumber${this.id}`;
		const varName = `randomNumber${this.id}`;

		let src = `\n\n`;
		src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Math", "RandomNumber").RandomNumber \n`;
		src += `local ${varName} = ${className}.new() \n`;

		const range = this.nodeFields.range.GetValue();
		src += `${varName}.nodeFields.range.SetMinValue(${range.X}) \n`;
		src += `${varName}.nodeFields.range.SetMaxValue(${range.Y}) \n`;

		if (wrapper !== undefined) {
			src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
		}
		return src;
	}
}
