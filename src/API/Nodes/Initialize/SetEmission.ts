import { GetParticleData } from "API/ParticleService";
import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

export class SetEmission extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		emission: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			emission: new NumberField(1),
		};
	}

	Initialize(id: number) {
		GetParticleData(id).particle.SurfaceGui.Brightness = this.nodeFields.emission.GetValue();
	}

	GetAutoGenerationCode() {
		return "";
	}
}
