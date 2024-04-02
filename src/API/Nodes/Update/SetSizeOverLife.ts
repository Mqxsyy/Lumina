import { LineGraphField } from "API/Fields/LineGraphField";
import { NodeGroups } from "API/NodeGroup";
import { UpdateParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class SetSizeOverLife extends UpdateNode {
	nodeGroup: NodeGroups = NodeGroups.Update;
	nodeFields = {};
	graph = new LineGraphField();

	constructor() {
		super();
	}

	Update(id: number) {
		UpdateParticleData(id, (data) => {
			const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
			const size = this.graph.GetValue(lifetime);
			const sizeVector3 = new Vector3(size, size, 0.001);

			data.size = sizeVector3;
			data.particle.Size = sizeVector3;

			return data;
		});
	}

	GetAutoGenerationCode() {
		return "";
	}
}
