import { ParticleData } from "API/ParticleService";
import { ConnectableNumberField } from "../../Fields/ConnectableNumberField";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetEmission } from "../AutoGeneration/InitializeNodes/AutoGenSetEmission";
import { InitializeNode } from "./InitializeNode";

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

    GetAutoGenerationCode() {
        return AutoGenSetEmission(this);
    }
}
