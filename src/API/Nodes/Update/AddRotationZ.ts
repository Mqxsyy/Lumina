import { NumberField } from "API/Fields/NumberField";
import { FrameRateMultiplier } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenAddRotationZ } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationZ";
import { UpdateNode } from "./UpdateNode";

export const AddRotationZName = "AddRotationZ";
export const AddRotationZFieldNames = {
    rotation: "rotation",
};

export class AddRotationZ extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        rotation: NumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            rotation: new NumberField(0),
        };
    }

    Update(data: ParticleData) {
        const zAddition = this.nodeFields.rotation.GetNumber() * FrameRateMultiplier;
        const rotation = data.rotation;

        data.rotation = new Vector3(rotation.X, rotation.Y, rotation.Z + zAddition);
    }

    GetNodeName(): string {
        return AddRotationZName;
    }

    GetAutoGenerationCode() {
        return AutoGenAddRotationZ(this);
    }
}
