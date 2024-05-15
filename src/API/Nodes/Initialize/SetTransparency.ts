import { GetParticleData, ParticleData } from "API/ParticleService";
import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetTransparency } from "../AutoGeneration/InitializeNodes/AutoGenSetTransparency";
import { InitializeNode } from "./InitializeNode";

export const SetTransparencyName = "SetTransparency";
export const SetTransparencyFieldNames = {
    transparency: "transparency",
};

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

    Initialize(data: ParticleData) {
        data.transparency = this.nodeFields.transparency.GetNumber();
    }

    GetNodeName(): string {
        return SetTransparencyName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetTransparency(this);
    }
}
