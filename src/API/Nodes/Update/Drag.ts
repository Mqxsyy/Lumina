import { NumberField } from "API/Fields/NumberField";
import { FrameRateMultiplier, LerpNumber } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { UpdateParticleData } from "API/ParticleService";
import { AutoGenDrag } from "../AutoGeneration/UpdateNodes/AutoGenDrag";
import { UpdateNode } from "./UpdateNode";

export const DragName = "Drag";
export const DragFieldNames = {
	drag: "drag",
};

export class Drag extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields: {
		drag: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			drag: new NumberField(0),
		};
	}

	Update(id: number) {
		const drag = this.nodeFields.drag.GetNumber() * FrameRateMultiplier;

		UpdateParticleData(id, (data) => {
			const oldVelocity = data.velocity;

			const x = LerpNumber(oldVelocity.X, 0, drag);
			const y = LerpNumber(oldVelocity.Y, 0, drag);
			const z = LerpNumber(oldVelocity.Z, 0, drag);

			data.velocity = new Vector3(x, y, z);
			return data;
		});
	}

	GetNodeName(): string {
		return DragName;
	}

	GetAutoGenerationCode() {
		return AutoGenDrag(this);
	}
}
