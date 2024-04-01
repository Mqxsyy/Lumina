import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { NumberField } from "API/Fields/NumberField";
import { GetParticleData } from "API/ParticleService";
import { FrameRateMultiplier } from "API/Lib";

export class AddRotationZ extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields: {
		rotation: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			rotation: new NumberField(0),
		};
	}

	Update(id: number) {
		const particle = GetParticleData(id).particle;
		const zAddition = this.nodeFields.rotation.GetValue() * FrameRateMultiplier;
		const rotation = new Vector3(particle.Rotation.X, particle.Rotation.Y, particle.Rotation.Z + zAddition);
		GetParticleData(id).particle.Rotation = rotation;
	}

	GetAutoGenerationCode() {
		return "";
	}
}
