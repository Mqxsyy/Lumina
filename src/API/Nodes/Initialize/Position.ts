import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "../../NodeGroup";
import { Node } from "../Node";
import { NodeTypes } from "../NodeTypes";

export class Position extends Node {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeType: NodeTypes = NodeTypes.Position;
	nodeFields: {
		position: Vector3Field;
	};

	constructor(id: number) {
		super(id);

		this.nodeFields = {
			position: new Vector3Field(),
		};
	}

	fn = (): Vector3 => {
		return this.nodeFields.position.GetValue() as Vector3;
	};
}
