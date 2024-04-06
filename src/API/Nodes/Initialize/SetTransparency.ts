import { GetParticleData } from "API/ParticleService";
import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetTransparency } from "../AutoGeneration/InitializeNodes/AutoGenSetTransparency";
import { InitializeNode } from "./InitializeNode";

export class SetTransparency extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeFields: {
		transparency: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			transparency: new NumberField(0),
		};
	}

	Initialize(id: number) {
		GetParticleData(id).particle.SurfaceGui.ImageLabel.ImageTransparency = this.nodeFields.transparency.GetNumber();
	}

	GetAutoGenerationCode() {
		return AutoGenSetTransparency(this);
	}
}
