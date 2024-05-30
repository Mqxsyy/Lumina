import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetRotationXYZName = "SetRotationXYZ";
export const SetRotationXYZFieldNames = {
    rotation: "rotation",
};

export class SetRotationXYZ extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        rotation: new ConnectableVector3Field(0, 0, 0),
    };

    Initialize(data: ParticleData) {
        const rotation = this.nodeFields.rotation.GetSimpleVector3(data);
        data.rotation = new Vector3(rotation.x, rotation.y, rotation.z);
    }

    GetNodeName(): string {
        return SetRotationXYZName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`, src);
        });
    }
}
