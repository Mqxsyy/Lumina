import { Vector2Field } from "API/Fields/Vector2Field";
import { NodeGroups } from "API/NodeGroup";
import { NodeTypes } from "API/Nodes/NodeTypes";
import { LogicNode } from "../LogicNode";
import { BooleanField } from "API/Fields/BooleanField";

export class RandomNumberNode extends LogicNode {
	nodeGroup: NodeGroups = NodeGroups.Logic;
	nodeType: NodeTypes = NodeTypes.RandomNumber;
	nodeFields: {
		range: Vector2Field;
		isInt: BooleanField;
		randomizeOnce: BooleanField;
	};

	random: Random;

	storedValues: Map<number, number> = new Map<number, number>();

	constructor() {
		super();

		this.random = new Random(os.clock());

		this.nodeFields = {
			range: new Vector2Field(new Vector2(1, 10)),
			isInt: new BooleanField(false),
			randomizeOnce: new BooleanField(false),
		};
	}

	GetRandom(): number {
		const range = this.nodeFields.range.GetValue();
		let value = range.X + this.random.NextNumber() * (range.Y - range.X);

		if (this.nodeFields.isInt.GetValue()) {
			value = math.round(value);
		}

		return range.X + this.random.NextNumber() * (range.Y - range.X);
	}

	Calculate = (id: number): number => {
		if (this.nodeFields.randomizeOnce.GetValue()) {
			let value = this.storedValues.get(id);
			if (value !== undefined) {
				return value;
			}

			value = this.GetRandom();
			this.storedValues.set(id, value);
			return value;
		}

		return this.GetRandom();
	};
}
