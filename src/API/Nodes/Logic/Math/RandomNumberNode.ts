import { Vector2Field } from "API/Fields/Vector2Field";
import { NodeGroups } from "API/NodeGroup";
import { NodeTypes } from "API/Nodes/NodeTypes";
import { LogicNode } from "../LogicNode";

export class RandomNumberNode extends LogicNode {
	nodeGroup: NodeGroups = NodeGroups.Logic;
	nodeType: NodeTypes = NodeTypes.RandomNumber;
	nodeFields: {
		range: Vector2Field;
	};

	random: Random;

	constructor() {
		super();

		this.random = new Random(os.clock());

		this.nodeFields = {
			range: new Vector2Field(new Vector2(1, 10)),
		};
	}

	Calculate = (): number => {
		const range = this.nodeFields.range.GetValue();
		return this.random.NextInteger(range.X, range.Y);
	};
}
