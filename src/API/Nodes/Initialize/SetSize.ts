import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetSize } from "../AutoGeneration/InitializeNodes/AutoGenSetSize";
import { InitializeNode } from "./InitializeNode";

export const SetSizeName = "SetSize";
export const SetSizeFieldNames = {
    size: "size",
};

export class SetSize extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        size: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            size: new ConnectableNumberField(1),
        };
    }

    Initialize(data: ParticleData) {
        const size = this.nodeFields.size.GetNumber(data);
        data.sizeNormal = new Vector3(size, size, size);
    }

    GetNodeName(): string {
        return SetSizeName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenSetSize(this, src);
    }
}
