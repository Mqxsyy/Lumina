import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { FrameRateMultiplier } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenAddRotationXYZ } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationXYZ";
import { UpdateNode } from "./UpdateNode";

export const AddRotationXYZName = "AddRotationXYZ";
export const AddRotationXYZFieldNames = {
    rotation: "rotation",
};

export class AddRotationXYZ extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        rotation: ConnectableVector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            rotation: new ConnectableVector3Field(0, 0, 0),
        };
    }

    Update(data: ParticleData) {
        const addition = this.nodeFields.rotation.GetVector3(data);
        const rotation = data.rotation;

        const x = rotation.X + addition.x * FrameRateMultiplier;
        const y = rotation.Y + addition.y * FrameRateMultiplier;
        const z = rotation.Z + addition.z * FrameRateMultiplier;

        data.rotation = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return AddRotationXYZName;
    }

    GetAutoGenerationCode() {
        return AutoGenAddRotationXYZ(this);
    }
}
