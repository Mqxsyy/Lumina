import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";
import { Vector2Field } from "API/Fields/Vector2Field";
import { Rand, RoundDecimal } from "API/Lib";

export class SetVelocityRandom extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		rangeX: Vector2Field;
		rangeY: Vector2Field;
		rangeZ: Vector2Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			rangeX: new Vector2Field(Vector2.zero),
			rangeY: new Vector2Field(Vector2.zero),
			rangeZ: new Vector2Field(Vector2.zero),
		};
	}

	Initialize(id: number) {
		const xRange = this.nodeFields.rangeX.GetValue();
		const x = RoundDecimal(Rand.NextNumber(xRange.X, xRange.Y), 0.01);

		const yRange = this.nodeFields.rangeY.GetValue();
		const y = RoundDecimal(Rand.NextNumber(yRange.X, yRange.Y), 0.01);

		const zRange = this.nodeFields.rangeZ.GetValue();
		const z = RoundDecimal(Rand.NextNumber(zRange.X, zRange.Y), 0.01);

		UpdateParticleData(id, (data) => {
			data.velocity = new Vector3(x, y, z);
			return data;
		});
	}

	GetAutoGenerationCode() {
		return "";
	}
}
