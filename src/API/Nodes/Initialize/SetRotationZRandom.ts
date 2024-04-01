import { Vector2Field } from "API/Fields/Vector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import { GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

export class SetRotationZRandom extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		range: Vector2Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			range: new Vector2Field(Vector2.zero),
		};
	}

	Initialize(id: number) {
		const range = this.nodeFields.range.GetValue();
		const zRotation = RoundDecimal(Rand.NextNumber(range.X, range.Y), 0.01);
		const particle = GetParticleData(id).particle;
		const rotation = new Vector3(particle.Rotation.X, particle.Rotation.Y, zRotation);
		GetParticleData(id).particle.Rotation = rotation;
	}

	GetAutoGenerationCode() {
		return "";
	}
}
