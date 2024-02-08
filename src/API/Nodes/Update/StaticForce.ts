import { Vector3Field } from "API/Fields/Vector3Field";
import { INodeField } from "../../Fields/NodeField";
import { NodeGroups } from "../../NodeGroup";
import { Node } from "../Node";
import { NodeTypes } from "../NodeTypes";
import { BooleanField } from "API/Fields/BooleanField";

export class StaticForce extends Node {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeType: NodeTypes = NodeTypes.Position;
	nodeFields: INodeField[] = [];

	constructor(id: number, direction: Vector3, isLocal: boolean) {
		super(id);
		this.nodeFields.push(new Vector3Field(direction));
		this.nodeFields.push(new BooleanField(isLocal));
	}

	// unknown to match INode
	fn(position: Vector3): Vector3 {
		return position.add(this.nodeFields[0].GetValue() as Vector3);
	}
}
