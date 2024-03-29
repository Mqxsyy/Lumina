import { ColorField } from "API/Fields/ColorField";
import { GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

export class SetColor extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		color: ColorField;
	};

	constructor() {
		super();

		this.nodeFields = {
			color: new ColorField(0, 1, 1),
		};
	}

	Initialize(id: number) {
		const particleData = GetParticleData(id);
		particleData.particle.SurfaceGui.ImageLabel.ImageColor3 = this.nodeFields.color.GetColor();
	}

	GetAutoGenerationCode() {
		return "";
	}
}
