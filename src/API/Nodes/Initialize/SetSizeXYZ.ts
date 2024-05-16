import { Vector3Field } from "API/Fields/Vector3Field";
import { ParticleData } from "API/ParticleService";
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
        size: Vector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            size: new Vector3Field(1, 1, 1),
        };
    }

    Initialize(data: ParticleData) {
        const size = this.nodeFields.size.GetVector3();
        data.sizeNormal = new Vector3(size.x, size.y, size.z);
    }

    GetNodeName(): string {
        return SetSizeXYZName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetSizeXYZ(this);
    }
}