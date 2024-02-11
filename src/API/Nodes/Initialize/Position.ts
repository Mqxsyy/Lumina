import { Vector3Field } from "API/Fields/Vector3Field";
import { INodeField } from "../../Fields/NodeField";
import { NodeGroups } from "../../NodeGroup";
import { Node } from "../Node";
import { NodeTypes } from "../NodeTypes";

export class Position extends Node {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeType: NodeTypes = NodeTypes.Position;
	nodeFields: INodeField[] = [];

	constructor(id: number, position: Vector3) {
		super(id);
		this.nodeFields.push(new Vector3Field(position));
	}

	fn = (): Vector3 => {
		return this.nodeFields[0].GetValue() as Vector3;
	};
}
