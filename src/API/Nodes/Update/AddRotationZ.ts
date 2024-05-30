import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenUpdateNode, UpdateNode } from "./UpdateNode";

export const AddRotationZName = "AddRotationZ";
export const AddRotationZFieldNames = {
    rotation: "rotation",
};

export class AddRotationZ extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        rotation: new ConnectableNumberField(0),
    };

    Update(data: ParticleData, dt: number) {
        const zAddition = this.nodeFields.rotation.GetNumber(data) * dt;
        const rotation = data.rotation;

        data.rotation = new Vector3(rotation.X, rotation.Y, rotation.Z + zAddition);
    }

    GetNodeName(): string {
        return AddRotationZName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenUpdateNode(this, src, (varName) => {
            this.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`, src);
        });
    }
}
