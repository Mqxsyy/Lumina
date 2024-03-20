import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { GetParticleData } from "API/ParticleService";
import { AutoGenTransparencyOverLife } from "../AutoGeneration/UpdateNodes/AutoGenTransparencyOverLife";

export class TransparencyOverLife extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields = {};

	constructor() {
		super();
	}

	Update(id: number) {
		const particleData = GetParticleData(id);
		const lifetime = (os.clock() - particleData.spawnTime) / particleData.lifetime;
		particleData.particle.SurfaceGui.ImageLabel.ImageTransparency = lifetime;
	}

	GetAutoGenerationCode() {
		return AutoGenTransparencyOverLife(this);
	}
}
