import { UpdateParticleData } from "API/ParticleService";
import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenLifetime } from "../AutoGeneration/InitializeNodes/AutoGenLifetime";
import { InitializeNode } from "./InitializeNode";

export class Lifetime extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		time: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			time: new NumberField(1),
		};
	}

	Initialize(id: number) {
		UpdateParticleData(id, (data) => {
			data.lifetime = this.nodeFields.time.GetValue();
			return data;
		});
	}

	GetAutoGenerationCode() {
		return AutoGenLifetime(this);
	}
}
