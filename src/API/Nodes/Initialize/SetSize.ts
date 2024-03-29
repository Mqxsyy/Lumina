import { NumberField } from "API/Fields/NumberField";
import { GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

export class SetSize extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		size: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			size: new NumberField(1),
		};
	}

	Initialize(id: number) {
		const particleData = GetParticleData(id);
		const size = this.nodeFields.size.GetValue();
		particleData.particle.Size = new Vector3(size, size, 0.001);
	}

	GetAutoGenerationCode() {
		return "";
	}
}
