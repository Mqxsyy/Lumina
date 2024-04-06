import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { NumberField } from "API/Fields/NumberField";
import { GetParticleData } from "API/ParticleService";
import { FrameRateMultiplier } from "API/Lib";
import { AutoGenAddRotationZ } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationZ";

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
		const zAddition = this.nodeFields.rotation.GetNumber() * FrameRateMultiplier;
		GetParticleData(id).particle.SurfaceGui.ImageLabel.Rotation += zAddition;
	}

	GetAutoGenerationCode() {
		return AutoGenAddRotationZ(this);
	}
}
