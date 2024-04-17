import { ColorRampField } from "API/Fields/ColorRampField";
import { NodeGroups } from "API/NodeGroup";
import { GetParticleData } from "API/ParticleService";
import { AutoGenSetColorOverLife } from "../AutoGeneration/UpdateNodes/AutoGenSetColorOverLife";
import { UpdateNode } from "./UpdateNode";

export const SetColorOverLifeName = "SetColorOverLife";
export const SetColorOverLifeFieldNames = {
	ramp: "ramp",
};

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

	GetNodeName(): string {
		return SetColorOverLifeName;
	}

	GetAutoGenerationCode() {
		return AutoGenSetColorOverLife(this);
	}
}
