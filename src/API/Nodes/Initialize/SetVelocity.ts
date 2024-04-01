import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";
import { Vector3Field } from "API/Fields/Vector3Field";

export class SetVelocity extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		velocity: Vector3Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			velocity: new Vector3Field(Vector3.zero),
		};
	}

	Initialize(id: number) {
		UpdateParticleData(id, (data) => {
			data.velocity = this.nodeFields.velocity.GetValue();
			return data;
		});
	}

	GetAutoGenerationCode() {
		return "";
	}
}
