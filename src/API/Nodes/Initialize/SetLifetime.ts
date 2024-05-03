import { UpdateParticleData } from "API/ParticleService";
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

    Initialize(id: number) {
        UpdateParticleData(id, (data) => {
            data.lifetime = this.nodeFields.time.GetNumber();
            return data;
        });
    }

    GetNodeName(): string {
        return SetLifetimeName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetLifetime(this);
    }
}
