import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { GetParticleData } from "API/ParticleService";
import { FrameRateMultiplier, Rand, RoundDecimal } from "API/Lib";
import { Vector2Field } from "API/Fields/Vector2Field";

export class AddRotationZRandom extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields: {
		range: Vector2Field;
	};

	storedValues = new Map<number, number>();

	constructor() {
		super();

		this.nodeFields = {
			range: new Vector2Field(Vector2.zero),
		};
	}

	Update(id: number) {
		const particle = GetParticleData(id).particle;

		let zAddition = this.storedValues.get(id);
		if (zAddition === undefined) {
			const range = this.nodeFields.range.GetValue();
			zAddition = RoundDecimal(Rand.NextNumber(range.X, range.Y) * FrameRateMultiplier, 0.01);
			this.storedValues.set(id, zAddition);
		}

		const rotation = new Vector3(particle.Rotation.X, particle.Rotation.Y, particle.Rotation.Z + zAddition);
		particle.Rotation = rotation;
	}

	GetAutoGenerationCode() {
		return "";
	}
}
