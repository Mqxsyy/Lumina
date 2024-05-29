import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { ConnectableNumberField } from "../../Fields/ConnectableNumberField";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetEmissionName = "SetEmission";
export const SetEmissionFieldNames = {
    emission: "emission",
};

export class SetEmission extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        emission: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            emission: new ConnectableNumberField(1),
        };
    }

    Initialize(data: ParticleData) {
        data.emission = this.nodeFields.emission.GetNumber(data);
    }

    GetNodeName(): string {
        return SetEmissionName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.emission.AutoGenerateField(`${varName}.nodeFields.emission`, src);
        });
    }
}
