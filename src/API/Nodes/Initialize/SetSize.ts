import { NumberField } from "API/Fields/NumberField";
import { UpdateParticleData } from "API/ParticleService";
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
		UpdateParticleData(id, (data) => {
			const size = this.nodeFields.size.GetValue();
			const sizeVector3 = new Vector3(size, size, 0.001);

			data.size = sizeVector3;
			data.particle.Size = sizeVector3;

			return data;
		});
	}

	GetAutoGenerationCode() {
		return "";
	}
}
