import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetSizeXYZ } from "../AutoGeneration/InitializeNodes/AutoGenSetSizeXYZ";
import { InitializeNode } from "./InitializeNode";

export const SetSizeXYZName = "SetSizeXYZ";
export const SetSizeXYZFieldNames = {
    size: "size",
};

export class SetSizeXYZ extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        size: ConnectableVector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            size: new ConnectableVector3Field(1, 1, 1),
        };
    }

    Initialize(data: ParticleData) {
        const size = this.nodeFields.size.GetVector3(data);
        data.sizeNormal = new Vector3(size.x, size.y, size.z);
    }

    GetNodeName(): string {
        return SetSizeXYZName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenSetSizeXYZ(this, src);
    }
}
