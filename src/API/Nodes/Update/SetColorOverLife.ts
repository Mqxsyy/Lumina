import { NodeGroups } from "API/NodeGroup";
import { UpdateNode } from "./UpdateNode";
import { GetParticleData } from "API/ParticleService";
import { ColorRampField } from "API/Fields/ColorRampField";
import { AutoGenSetColorOverLife } from "../AutoGeneration/UpdateNodes/AutoGenSetColorOverLife";

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
		particleData.particle.SurfaceGui.ImageLabel.ImageColor3 = this.nodeFields.ramp.GetColor(lifetime);
	}

	GetAutoGenerationCode() {
		return AutoGenSetColorOverLife(this);
	}
}
