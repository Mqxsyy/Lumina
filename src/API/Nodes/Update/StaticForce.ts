import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { BooleanField } from "API/Fields/BooleanField";
import { UpdateNode } from "./UpdateNode";

export class StaticForce extends UpdateNode<[Vector3]> {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeType: NodeTypes = NodeTypes.Position;
	nodeFields: {
		direction: Vector3Field;
		isLocal: BooleanField;
	};

	// add id tracker per node so one random node can be used for multiple fields
	constructor() {
		super();

		this.nodeFields = {
			direction: new Vector3Field(new Vector3(0, 0.1, 0)),
			isLocal: new BooleanField(true),
		};
	}

	UpdateValue = (id: number, position: Vector3): Vector3 => {
		return position.add(this.nodeFields.direction.GetValue(id));
	};
}
