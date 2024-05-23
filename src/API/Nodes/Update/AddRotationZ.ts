import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { FrameRateMultiplier } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenAddRotationZ } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationZ";
import { UpdateNode } from "./UpdateNode";

export const AddRotationZName = "AddRotationZ";
export const AddRotationZFieldNames = {
    rotation: "rotation",
};

export class AddRotationZ extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        rotation: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            rotation: new ConnectableNumberField(0),
        };
    }

    Update(data: ParticleData) {
        const zAddition = this.nodeFields.rotation.GetNumber(data) * FrameRateMultiplier;
        const rotation = data.rotation;

        data.rotation = new Vector3(rotation.X, rotation.Y, rotation.Z + zAddition);
    }

    GetNodeName(): string {
        return AddRotationZName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenAddRotationZ(this, src);
    }
}
