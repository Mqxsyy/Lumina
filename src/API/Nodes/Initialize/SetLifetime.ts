import { ParticleData } from "API/ParticleService";
import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetLifetime } from "../AutoGeneration/InitializeNodes/AutoGenSetLifetime";
import { InitializeNode } from "./InitializeNode";

export const SetLifetimeName = "SetLifetime";
export const SetLifetimeFieldNames = {
    time: "time",
};

export class SetLifetime extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        time: NumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            time: new NumberField(1),
        };
    }

    Initialize(data: ParticleData) {
        data.lifetime = this.nodeFields.time.GetNumber();
    }

    GetNodeName(): string {
        return SetLifetimeName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetLifetime(this);
    }
}
