import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { GetParticleData } from "API/ParticleService";
import { ColorRampField } from "API/Fields/ColorRampField";

export class SetColorOverLife extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields = {
		ramp: new ColorRampField(),
	};

	constructor() {
		super();
	}

	Update(id: number) {
		const particleData = GetParticleData(id);
		const lifetime = (os.clock() - particleData.spawnTime) / particleData.lifetime;
		particleData.particle.SurfaceGui.ImageLabel.ImageColor3 = this.nodeFields.ramp.GetValue(lifetime);
	}

	GetAutoGenerationCode() {
		return "";
	}
}
