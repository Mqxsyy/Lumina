import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { InitializeNode } from "./InitializeNode";
import { CreatePositionNode } from "Components/Nodes/Initialize/Position";

export class Position extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeType: NodeTypes = NodeTypes.Position;
	nodeFields: {
		position: Vector3Field;
	};
	nodeElement = () =>
		CreatePositionNode(
			this.nodeFields.position.SetValueX,
			this.nodeFields.position.SetValueY,
			this.nodeFields.position.SetValueZ,
		);

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
