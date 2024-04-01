import { NumberField } from "API/Fields/NumberField";
import { GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

export class SetRotationZ extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		rotation: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			rotation: new NumberField(0),
		};
	}

	Initialize(id: number) {
		const particle = GetParticleData(id).particle;
		const rotation = new Vector3(particle.Rotation.X, particle.Rotation.Y, this.nodeFields.rotation.GetValue());
		GetParticleData(id).particle.Rotation = rotation;
	}

	GetAutoGenerationCode() {
		return "";
	}
}
