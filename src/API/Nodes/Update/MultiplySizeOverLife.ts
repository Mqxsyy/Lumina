import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { GetParticleData } from "API/ParticleService";
import { LineGraphField } from "API/Fields/LineGraphField";

export class MultiplySizeOverLife extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields = {};
	graph = new LineGraphField();

	constructor() {
		super();
	}

	Update(id: number) {
		const particleData = GetParticleData(id);
		const lifetime = (os.clock() - particleData.spawnTime) / particleData.lifetime;
		const muliplier = this.graph.GetValue(lifetime);

		const particle = particleData.particle;
		const x = particle.Size.X * muliplier;
		const y = particle.Size.Y * muliplier;

		particleData.particle.Size = new Vector3(x, y, 0.001);
	}

	GetAutoGenerationCode() {
		return "";
	}
}
