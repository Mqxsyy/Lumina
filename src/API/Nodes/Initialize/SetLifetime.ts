import type { ParticleData } from "API/ParticleService";
import { ConnectableNumberField } from "../../Fields/ConnectableNumberField";
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
        time: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            time: new ConnectableNumberField(1),
        };
    }

    Initialize(data: ParticleData) {
        data.lifetime = this.nodeFields.time.GetNumber(data);
    }

    GetNodeName(): string {
        return SetLifetimeName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetLifetime(this);
    }
}
