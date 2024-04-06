import { Vector2Field } from "API/Fields/Vector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";
import { AutoGenSetSizeRandom } from "../AutoGeneration/InitializeNodes/AutoGenSetSizeRandom";

export class SetSizeRandom extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		range: Vector2Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			range: new Vector2Field(0, 0),
		};
	}

	Initialize(id: number) {
		UpdateParticleData(id, (data) => {
			const range = this.nodeFields.range.GetVector2();
			const size = RoundDecimal(Rand.NextNumber(range.X, range.Y), 0.01);
			const sizeVector3 = new Vector3(size, size, 0.001);

			data.size = sizeVector3;
			data.particle.Size = sizeVector3;

			return data;
		});
	}

	GetAutoGenerationCode() {
		return AutoGenSetSizeRandom(this);
	}
}
