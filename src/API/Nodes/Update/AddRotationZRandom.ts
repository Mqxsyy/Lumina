import { Vector2Field } from "API/Fields/Vector2Field";
import { FrameRateMultiplier, Rand, RoundDecimal } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { GetParticleData } from "API/ParticleService";
import { AutoGenAddRotationZRandom } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationZRandom";
import { UpdateNode } from "./UpdateNode";

export const AddRotationZRandomName = "AddRotationZRandom";
export const AddRotationZRandomFieldNames = {
	range: "range",
};

export class AddRotationZRandom extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields: {
		range: Vector2Field;
	};

	storedValues = new Map<number, number>();

	constructor() {
		super();

		this.nodeFields = {
			range: new Vector2Field(0, 0),
		};
	}

	Update(id: number) {
		let zAddition = this.storedValues.get(id);
		if (zAddition === undefined) {
			const range = this.nodeFields.range.GetVector2();
			zAddition = RoundDecimal(Rand.NextNumber(range.X, range.Y) * FrameRateMultiplier, 0.01);
			this.storedValues.set(id, zAddition);
		}

		GetParticleData(id).particle.SurfaceGui.ImageLabel.Rotation += zAddition;
	}

	GetNodeName(): string {
		return AddRotationZRandomName;
	}

	GetAutoGenerationCode() {
		return AutoGenAddRotationZRandom(this);
	}
}
