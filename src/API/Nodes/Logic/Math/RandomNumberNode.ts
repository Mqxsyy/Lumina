import { Vector2Field } from "API/Fields/Vector2Field";
import { NodeGroups } from "API/NodeGroup";
import { Node } from "API/Nodes/Node";
import { NodeTypes } from "API/Nodes/NodeTypes";

export class RandomNumberNode extends Node {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeType: NodeTypes = NodeTypes.Lifetime;
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

	fn = (): number => {
		const range = this.nodeFields.range.GetValue();
		return this.random.NextInteger(range.X, range.Y);
	};
}
