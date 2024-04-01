import { Vector2Field } from "API/Fields/Vector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

export class SetLifetimeRandom extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		range: Vector2Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			range: new Vector2Field(new Vector2(0.5, 1)),
		};
	}

	Initialize(id: number) {
		const range = this.nodeFields.range.GetValue();
		const lifetime = RoundDecimal(Rand.NextNumber(range.X, range.Y), 0.01);

		UpdateParticleData(id, (data) => {
			data.lifetime = lifetime;
			return data;
		});
	}

	GetAutoGenerationCode() {
		return "";
	}
}
