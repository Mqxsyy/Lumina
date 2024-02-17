import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { InitializeNode } from "./InitializeNode";

export class Position extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeType: NodeTypes = NodeTypes.Position;
	nodeFields: {
		position: Vector3Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			position: new Vector3Field(new Vector3(0, 0, 0)),
		};
	}

	GetValue = (): Vector3 => {
		return this.nodeFields.position.GetValue() as Vector3;
	};
}
