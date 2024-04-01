import { Vector2Field } from "API/Fields/Vector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import { GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

export class SetSizeRandom extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		range: Vector2Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			range: new Vector2Field(new Vector2(1, 2)),
		};
	}

	Initialize(id: number) {
		const range = this.nodeFields.range.GetValue();
		const size = RoundDecimal(Rand.NextNumber(range.X, range.Y), 0.01);
		GetParticleData(id).particle.Size = new Vector3(size, size, 0.001);
	}

	GetAutoGenerationCode() {
		return "";
	}
}
