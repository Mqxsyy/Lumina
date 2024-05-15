import { Vector3Field } from "API/Fields/Vector3Field";
import { ParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetRotationXYZ } from "../AutoGeneration/InitializeNodes/AutoGenSetRotation";
import { InitializeNode } from "./InitializeNode";

export const SetRotationXYZName = "SetRotationXYZ";
export const SetRotationXYZFieldNames = {
    rotation: "rotation",
};

export class SetRotationXYZ extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        rotation: Vector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            rotation: new Vector3Field(0, 0, 0),
        };
    }

    Initialize(data: ParticleData) {
        const rotation = this.nodeFields.rotation.GetVector3();
        data.rotation = new Vector3(rotation.x, rotation.y, rotation.z);
    }

    GetNodeName(): string {
        return SetRotationXYZName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetRotationXYZ(this);
    }
}
