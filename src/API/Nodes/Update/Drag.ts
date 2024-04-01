import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { NumberField } from "API/Fields/NumberField";
import { GetParticleData, UpdateParticleData } from "API/ParticleService";
import { FrameRateMultiplier, LerpNumber } from "API/Lib";

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
		const drag = this.nodeFields.drag.GetValue() * FrameRateMultiplier;

		UpdateParticleData(id, (data) => {
			const oldVelocity = data.velocity;

			const x = LerpNumber(oldVelocity.X, 0, drag);
			const y = LerpNumber(oldVelocity.Y, 0, drag);
			const z = LerpNumber(oldVelocity.Z, 0, drag);

			data.velocity = new Vector3(x, y, z);
			return data;
		});
	}

	GetAutoGenerationCode() {
		return "";
	}
}
