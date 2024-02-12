import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "../../NodeGroup";
import { Node } from "../Node";
import { NodeTypes } from "../NodeTypes";
import { BooleanField } from "API/Fields/BooleanField";

export class StaticForce extends Node<[Vector3]> {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeType: NodeTypes = NodeTypes.Position;
	nodeFields: {
		direction: Vector3Field;
		isLocal: BooleanField;
	};

	constructor() {
		super();

		this.nodeFields = {
			direction: new Vector3Field(new Vector3(0, 1, 0)),
			isLocal: new BooleanField(true),
		};
	}

	fn = (position: Vector3): Vector3 => {
		return position.add(this.nodeFields.direction.GetValue() as Vector3);
	};
}
