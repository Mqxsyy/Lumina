import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { Vector2Field } from "API/Fields/Vector2Field";
import { GetParticleData } from "API/ParticleService";

export class TransparencyOverLife extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields: {
		range: Vector2Field;
	};

	constructor() {
		super();

		this.nodeFields = {
			range: new Vector2Field(new Vector2(0, 1)),
		};
	}

	Update(id: number) {
		const particleData = GetParticleData(id);
		const transparency = particleData.spawnTime / particleData.lifetime;
		const particle = particleData.particle.SurfaceGui.ImageLabel.ImageTransparency;
	}

	GetAutoGenerationCode() {
		return "";
	}
}
