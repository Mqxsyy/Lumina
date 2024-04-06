import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";
import { AutoGenSetPosition } from "../AutoGeneration/InitializeNodes/AutoGenSetPosition";
import { GetParticleData } from "API/ParticleService";

export class SetPosition extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		position: Vector3Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			position: new Vector3Field(0, 0, 0),
		};
	}

	Initialize(id: number) {
		GetParticleData(id).particle.Position = this.nodeFields.position.GetVector3();
	}

	GetAutoGenerationCode() {
		return AutoGenSetPosition(this);
	}
}
