import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { GetParticleData } from "API/ParticleService";
import { LineGraphField } from "API/Fields/LineGraphField";

export class SizeOverLife extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields = {};
	graph = new LineGraphField();

	constructor() {
		super();
	}

	Update(id: number) {
		const particleData = GetParticleData(id);
		const lifetime = (os.clock() - particleData.spawnTime) / particleData.lifetime;
		const size = this.graph.GetValue(lifetime);
		particleData.particle.Size = new Vector3(size, size, 0.001);
	}

	GetAutoGenerationCode() {
		return "";
	}
}
