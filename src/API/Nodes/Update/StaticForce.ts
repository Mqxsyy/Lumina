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

	constructor(id: number) {
		super(id);

		this.nodeFields = {
			direction: new Vector3Field(),
			isLocal: new BooleanField(),
		};
	}

	fn = (position: Vector3): Vector3 => {
		return position.add(this.nodeFields.direction.GetValue() as Vector3);
	};
}
