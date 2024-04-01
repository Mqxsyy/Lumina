import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";
import { AutoGenPosition } from "../AutoGeneration/InitializeNodes/AutoGenPosition";
import { GetParticleData } from "API/ParticleService";

export class SetPosition extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		position: Vector3Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			position: new Vector3Field(new Vector3(0, 0, 0)),
		};
	}

	Initialize(id: number) {
		GetParticleData(id).particle.Position = this.nodeFields.position.GetValue();
	}

	GetAutoGenerationCode() {
		return AutoGenPosition(this);
	}
}
