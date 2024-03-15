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

	GetAutoGenerationCode(): string {
		let src = `local Position = TS.import(script, APIFolder, "Nodes", "Initialize", "Position").Position \n`;
		src += `local position = Position.new() \n`;

		if (this.nodeFields.position.xBindNode !== undefined) {
			src +=
				"\n" +
				this.nodeFields.position.xBindNode.GetAutoGenerationCode(
					`position.nodeFields.position.BindValueX(..)`,
				) +
				"\n";
		} else {
			src += `position.nodeFields.position.SetValueX(${this.nodeFields.position.x}) \n`;
		}

		if (this.nodeFields.position.yBindNode !== undefined) {
			src +=
				"\n" +
				this.nodeFields.position.yBindNode.GetAutoGenerationCode(
					`position.nodeFields.position.BindValueY(..)`,
				) +
				"\n";
		} else {
			src += `position.nodeFields.position.SetValueY(${this.nodeFields.position.y}) \n`;
		}

		if (this.nodeFields.position.zBindNode !== undefined) {
			src +=
				"\n" +
				this.nodeFields.position.zBindNode.GetAutoGenerationCode(
					`position.nodeFields.position.BindValueZ(..)`,
				) +
				"\n";
		} else {
			src += `position.nodeFields.position.SetValueZ(${this.nodeFields.position.z}) \n`;
		}

		src += `nodeSystem:AddNode(position)`;
		return src;
	}
}
