import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "../../NodeGroup";
import { BooleanField } from "API/Fields/BooleanField";
import { UpdateNode } from "./UpdateNode";
import { AutoGenStaticForce } from "../AutoGeneration/UpdateNodes/AutoGenStaticForce";
import { GetParticleData } from "API/ParticleService";

export class StaticForce extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields: {
		direction: Vector3Field;
		isLocal: BooleanField;
		storeValue: BooleanField;
	};

	storedValues: Map<number, Vector3> = new Map<number, Vector3>();

	// add id tracker per node so one random node can be used for multiple fields
	constructor() {
		super();

		this.nodeFields = {
			direction: new Vector3Field(new Vector3(0, 0.1, 0)),
			isLocal: new BooleanField(true),
			storeValue: new BooleanField(true),
		};
	}

	Update(id: number) {
		const particle = GetParticleData(id).particle;

		if (this.nodeFields.storeValue.GetValue()) {
			let direction = this.storedValues.get(id);
			if (direction !== undefined) {
				particle.Position = particle.Position.add(direction);
				return;
			}

			direction = this.nodeFields.direction.GetValue();
			this.storedValues.set(id, direction);
			particle.Position = particle.Position.add(direction);
			return;
		}

		particle.Position = particle.Position.add(this.nodeFields.direction.GetValue());
	}

	GetAutoGenerationCode(): string {
		return AutoGenStaticForce(this);
	}
}
